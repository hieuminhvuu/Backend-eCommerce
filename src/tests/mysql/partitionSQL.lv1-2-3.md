# Lv1 - level mầm non

Khi tạo bảng mới, chúng ta sẽ chia ra thành các partition khác nhau, qua đó dễ bề quản lý cũng như khi query thì ko mất công quét qua toàn bộ bảng gây lãng phí tài nguyên. Mỗi 1 partition sẽ lưu trữ 1 lượng dữ liệu trong 1 khoảng thời gian cụ thể.
Ví dụ :

-   Chúng ta có bảng orders chứa rất nhiều các order của khách hàng. Ví dụ như có 1000 product, mỗi product sinh ra 1000 order trong 1 ngày, con số order cho 1 tháng là 1000*1000*30= 30000000 (30 triệu)
-   Con số 30 triệu là rất nhiều, nếu tích luỹ dần lâu dài sẽ là quá khủng khiếp cho việc truy vấn
-   Chúng ta sẽ chi bảng order này ra thành nhiều partition, mỗi partition đảm nhiệm cho 1 tháng khác nhau.
-   Từ đây khi query, thêm điều kiện vào, ko cần quét qua cả bảng nữa mà chỉ quét qua phần cần thiết.

Query để tạo ra bảng có các partition cho mỗi tháng sẽ được viết thủ công như này:

```
create table orders (
    order_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2),
    PRIMARY KEY (order_id, order_date)
)

PARTITION BY RANGE COLUMNS (order_date) (
PARTITION p00 VALUES LESS THAN ('2023-10-01'),
PARTITION p10 VALUES LESS THAN ('2023-11-01'),
PARTITION p11 VALUES LESS THAN ('2023-12-01'),
PARTITION p12 VALUES LESS THAN ('2023-01-01'),
PARTITION pmax VALUES LESS THAN (MAXVALUE)
);
```

Sau đó, để truy vấn ta cần truy vấn kèm thêm điều kiện:

```
SELECT * FROM orders PARTITION (p10);
SELECT * FROM orders WHERE order_date>='2023-10-01' AND order_date<'2023-11-01';
```

Tiết kiệm được rất nhiều thời gian truy vấn rồi nè.

# Lv2 - trung học cơ sở

Cách trên dù đã tiết kiệm được rất nhiều thời gian truy vấn, nhưng tất cả order vẫn đang được lưu trữ trong cùng 1 bảng và việc tạo PARTITION mới cho các tháng sau nữa sẽ rất rắc rối.
Để tối ưu hơn, ta có thể tạo nhiều bảng, mỗi bảng lưu trữ cho 1 tháng khác nhau, giải quyết được truy vấn nhanh và lưu trữ không tập trung quá nhiều.
Chúng ta sẽ tạo 1 function, khi call tới function này thì tự động tạo bảng với tên được kiểm soát, nội dung file function như sau:

```
create
    definer = root@`%` procedure create_table_auto_month()
BEGIN
    DECLARE nextMonth VARCHAR(20);
    DECLARE createTableSQL VARCHAR(5210);
    DECLARE tableCount INT;
    DECLARE tableName VARCHAR(20);
    DECLARE table_prefix VARCHAR(20);
    SELECT SUBSTR(
        REPLACE(
                DATE_ADD(CURDATE(), INTERVAL 1 MONTH ),'-',''
            ), 1, 6
        ) INTO @nexMonth;
    SET @table_prefix = 'orders_';
    SET @tableName = CONCAT(@table_prefix, @nexMonth);
    SET @createTableSQL = CONCAT("CREATE TABLE IF NOT EXISTS ",@tableName,"
        (
            order_id INT,
            order_date DATE NOT NULL,
            total_amount DECIMAL(10,2),
            PRIMARY KEY (order_id, order_date)
        )");
    PREPARE create_stmt FROM @createTableSQL;
    EXECUTE create_stmt;
    DEALLOCATE PREPARE create_stmt;
    SELECT
        COUNT(1) INTO @tableCount
    FROM
        information_schema.`TABLES`
    WHERE TABLE_NAME = @tableName;
    SELECT @tableCount 'tableCount';
END;
```

Có file rồi, giờ chỉ việc call thôi :

```
CALL create_table_auto_month();
```

# Lv3 - trung học phổ thông trở lên

Ở level trên, chúng ta đã xử lý cả 2 vấn đề rồi, nhưng vẫn cần query bằng tay. Giờ ta cần để tất cả chạy tự động bằng cách thêm event cho db. Cách làm đơn giản là tạo file event cho chạy function trên mỗi tháng 1 lần bằng query sau:

```
create definer = root@`%` event create_table_auto_month_event on schedule
    every '1' MONTH
        starts '2023-11-15 00:00:00'
    on completion preserve
    enable
    do
    CALL create_table_auto_month();
```

Sau khi đã có event rồi, tất cả mọi chuyện sẽ tự động, cứ đến giữa tháng sẽ tạo thêm 1 bảng mới cho tháng sau. Hãy kiểm tra xem đã có event chưa bằng query:

```
SHOW EVENTS;
```

Nếu đã có rồi thì mọi chuyện đã tốt rồi. Move on đến những kiến thức mới hơn thôi!
