CREATE DEFINER=`root`@`%` PROCEDURE `create_table_auto_month`()
BEGIN
    -- dùng để ghi lại tháng tiếp theo dài bao nhiêu
    DECLARE nextMonth VARCHAR(20);

    -- câu lệnh SQL dùng để ghi lại việc tạo bảng
    DECLARE createTableSQL VARCHAR(5210);

    -- sau khi thực hiện câu lệnh SQL tạo bảng, lấy số lượng bảng
    DECLARE tableCount INT;

    -- dùng để ghi lại tên bảng cần tạo
    DECLARE tableName VARCHAR(20);

    -- tiền tố được sử dụng cho bảng ghi
    DECLARE table_prefix VARCHAR(20);

    -- lấy ngày của tháng tiếp theo và gán cho nó biến nextMonth
    SELECT SUBSTR(
        REPLACE(
                DATE_ADD(CURDATE(), INTERVAL 1 MONTH ),'-',''
            ), 1, 6
        ) INTO @nexMonth; -- 202310

    -- đặt giá trị biến tiền tố bảng thàng like this
    SET @table_prefix = 'orders_'; -- orders_202310

    -- xác định tên bảng = tên tiền tố bảng + tháng, tức là orders_202310, order_202311 Định dạng này
    SET @tableName = CONCAT(@table_prefix, @nexMonth);

    -- xác định câu lệnh SQL để tạo bảng
    SET @createTableSQL = CONCAT("CREATE TABLE IF NOT EXISTS ",@tableName,"
        (
            order_id INT, -- id hoá đơn
            order_date DATE NOT NULL,
            total_amount DECIMAL(10,2),
            PRIMARY KEY (order_id, order_date)
        )");

    -- sử dụng từ khoá PREPARE để tạo phần thân SQL được chuẩn bị sẵn sàng để thực thi
    PREPARE create_stmt FROM @createTableSQL;

    -- sử dụng từ khoá EXECUTE để thực thi phần thân SQL đã chuẩn bị ở trên: create_stmt
    EXECUTE create_stmt;

    -- giải phóng phần thân SQL đã tạo trước đó (giảm mức sử dụng bộ nhớ)
    DEALLOCATE PREPARE create_stmt;

    -- sau khi thực hiện câu lệnh tạo bảng này, hãy truy vấn số lượng bảng và lưu nó vào biến tableCount
    SELECT
        COUNT(1) INTO @tableCount
    FROM
        information_schema.`TABLES`
    WHERE TABLE_NAME = @tableName;

    -- kiểm tra xem bảng tương ứng đã tồn tại chưa
    SELECT @tableCount 'tableCount';
END;