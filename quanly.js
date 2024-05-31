//Sử dụng Framework Express
const express = require("express");
const sequence = require('sequence');
const crypto = require("crypto");
const app = express();
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
//Cổng lắng nghe
const port = 8080;
// // Tạo biến google lấy dữ liệu từ googleapis
// const { google } = require("googleapis");
//module gửi yêu cầu HTTP và xử lý các phản hồi từ máy chủ
const request = require("request");
//import cort vào cho phép tương tác giữa các trang web or nguồn tài nguyên từ các domain khác nhau
const cors = require("cors");
//phân tích URL
const urlParse = require("url-parse");
// phân tích và xử lý các chuỗi query parameters của URL
const queryParse = require("query-string");
const bodyParser = require("body-parser");
const axios = require("axios");
// Module oauth2 này cung cấp các phương thức để tương tác với Google OAuth2 API
// //đặc biệt là để xác thực và quản lý quyền truy cập OAuth 2.0.
// const { oauth2 } = require("googleapis/build/src/apis/oauth2");
// const { fitness } = require("googleapis/build/src/apis/fitness");
const { response } = require("express");
//một thư viện giúp gửi email từ máy chủ Node.js của bạn.
var nodemailer = require("nodemailer");
//xử lý dữ liệu đa phương tiện
const multer = require("multer");
//Bot telegram
// const TelegramBot = require("node-telegram-bot-api");
// const token = "6772120862:AAESMVkwrGRWW2OyKupw9Kq6c0dWe4Dwff8";
// const bot = new TelegramBot(token, { polling: true });
//làm lịch
const schedule = require("node-schedule");
//làm việc với đường dẫn tệp và thư mục
const path = require("path");
//Chuyển đổi dữ liệu JSON thành JavaScrip
app.use(express.json()); // for parsing application/json
//Chuyển dữ liệu dạng form thành JavaScrip
app.use(express.urlencoded({ extended: true }));

//KẾT NỐI TỚI MYSQL
var mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quanlysuckhoe",
});

//Định cấu hình multer để xử lý tải lên file và lưu trữ chúng
//trong một thư mục cụ thể trên máy chủ
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });
//Uphinh
app.get("/upload", (req, res) => {
  res.render("upload");
});
app.post("/upload", upload.single("image"), async (req, res) => {
  image = req.file;
  image2 = req.body.image;
  console.log(image);
  console.log(image.path);
});

//UpFileBenhAn
// app.get("/uploadfile", (req, res) => {
//   res.render("uploadfile");
// });
// app.post("/uploadfile", uploadfile.single("file"), async (req, res) => {
//   file1 = req.file;
//   file2 = req.body.file1;
//   console.log(file);
//   console.log(file.path);
// });


var session = require("express-session");
const { connect } = require("http2");
const { error } = require("console");
const { file } = require("googleapis/build/src/apis/file");
app.use(
  session({
    secret: "abcdefg",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);

//Thêm Bệnh Nhân
app.get("/themBenhNhan", (req, res) => {
  let sql = `SELECT * FROM bacsi`;
  db.query(sql, function (err, data) {

    res.render("themBenhNhan", { listbenhnhan: data, un: req.session.username });
  })
});
app.post("/themBenhNhan", upload.single("Image"), (req, res) => {
  // console.log(req.body);
  let image = req.file.filename;
  req.body.Avatar = image;
  db.query("insert into benhnhan SET ? ", req.body, function (err, data) {
    if (err) throw err;
    let u = req.body.MaBenhNhan;
    let p = req.body.MaBenhNhan;
    let q = 3;

    const bcrypt = require("bcrypt");
    var salt = bcrypt.genSaltSync(10);
    var pass_mahoa = bcrypt.hashSync(p, salt);

    let user_info = { TenDangNhap: u, MatKhau: pass_mahoa, Quyen: q };
    let sql = "INSERT INTO nguoidung SET ?";
    db.query(sql, user_info);

    let latlng_info = { Id_BenhNhan: u, Lat: null, Long: null, DiaChi: null, ThoiGian: null };
    let sql1 = "INSERT INTO vitri_benhnhan SET ?";
    db.query(sql1, latlng_info);

    res.redirect("/benhnhan");
  });
});


//Bác Sĩ
app.get("/bacsi", (req, res) => {
  let sql = `SELECT * FROM bacsi`;
  let _maBS = req.query.txttimkiem;

  if (_maBS) {
    sql += " where MaBacSi like '%" + _maBS + "%'";
  }

  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    res.render("bacsi", { listbacsi: data, un: req.session.username }); //nạp view và truyền dữ liệu cho view
  });
});


//Xem bác sĩ
app.get("/xembacsi", async (req, res) => {
  var mabacsi = req.query["mabacsi"];
  let sql = `SELECT benhnhan.*, bacsi.* , khoa.* FROM benhnhan inner join bacsi inner join khoa on benhnhan.MaBacSi = bacsi.MaBacSi AND bacsi.ChuyenMon = khoa.Id WHERE bacsi.MaBacSi='` + mabacsi + `'`;
  console.log(sql);
  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    console.log(data[0].NgaySinh.getFullYear());
    var yyyy = data[0].NgaySinh.getFullYear();
    var dd = data[0].NgaySinh.getDate();
    var mm = data[0].NgaySinh.getMonth() + 1;
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = dd + "/" + mm + "/" + yyyy;
    console.log(data);
    console.log(data[0]);
    res.render("xembacsi", {
      bacsi: data[0], listbacsi: data,
      un: req.session.username,
      sinh: formattedToday,
    }); //nạp view và truyền dữ liệu cho view
  });
});

//Thêm bác sĩ
app.get("/thembacsi", (req, res) => {
  let sql = `SELECT * FROM khoa`;
  db.query(sql, function (err, data) {

    res.render("thembacsi", { listbacsi: data, un: req.session.username });
  })
});
app.post("/thembacsi", (req, res) => {
  console.log(req.body);
  db.query("insert into bacsi SET ? ", req.body, function (err, data) {
    if (err) throw err;
    let u = req.body.MaBacSi;
    let p = req.body.MaBacSi;
    let q = 2;

    const bcrypt = require("bcrypt");
    var salt = bcrypt.genSaltSync(10);
    var pass_mahoa = bcrypt.hashSync(p, salt);

    let user_info = { TenDangNhap: u, MatKhau: pass_mahoa, Quyen: q };
    let sql = "INSERT INTO nguoidung SET ?";
    db.query(sql, user_info);
    res.redirect("/bacsi");
  });
});


//Sửa bác sĩ
app.get("/suabacsi", async (req, res) => {
  var mabacsi = req.query["mabacsi"];
  let sql = `SELECT * FROM bacsi WHERE MaBacSi='` + mabacsi + `'`;
  console.log(sql);

  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    console.log(data[0].NgaySinh.getFullYear());
    var yyyy = data[0].NgaySinh.getFullYear();
    var dd = data[0].NgaySinh.getDate();
    var mm = data[0].NgaySinh.getMonth() + 1;
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = yyyy + "-" + mm + "-" + dd;
    console.log(formattedToday);
    res.render("suabacsi", {
      bacsi: data[0],
      un: req.session.username,
      sinh: formattedToday,
    }); //nạp view và truyền dữ liệu cho view
  });
});

app.post("/suabacsi", (req, res) => {
  //console.log(req.body.MaBacSi);
  var mabacsi = req.body.MaBacSi;
  db.query(
    "update bacsi SET ? where MaBacSi=?",
    [req.body, mabacsi],
    function (err, data) {
      if (err) throw err;
    }
  );
  res.redirect("/bacsi");
});

//Xóa bác sĩ
app.get("/xoabacsi", async (req, res) => {
  var mabacsi = req.query["mabacsi"];
  let sql = `DELETE FROM bacsi WHERE MaBacSi='` + mabacsi + `'`;
  console.log(sql);
  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;

    res.redirect("/bacsi");
  });
});
//Khoa
app.get("/khoa", (req, res) => {
  let sql = `SELECT * FROM khoa`;

  // let _tenThuoc = req.query.txttimkiem;

  // if (_tenThuoc) {
  //   sql += " where TenThuoc like '%" + _tenThuoc + "%'";
  // }

  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    res.render("khoa", { listkhoa: data, un: req.session.username }); //nạp view và truyền dữ liệu cho view
  });
});

//Thêm Khoa
app.get("/themkhoa", (req, res) => {
  res.render("themkhoa", { un: req.session.username });
});

app.post("/themkhoa", (req, res) => {
  let id = req.body.Id;
  let tk = req.body.TenKhoa;

  let khoa_info = {
    Id: id,
    TenKhoa: tk,
  };
  let sql = "INSERT INTO khoa SET ?";
  db.query(sql, khoa_info);
  res.redirect("/khoa");
});

//Xóa Khoa
app.get("/xoakhoa", async (req, res) => {
  var id = req.query["id"];
  let sql = `DELETE FROM khoa WHERE Id='` + id + `'`;
  console.log(sql);
  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;

    res.redirect("/khoa");
  });
});
//Xem Danh Sách Bác Sĩ Theo Khoa
app.get("/xemkhoa", async (req, res) => {
  var id = req.query["id"];
  let sql = `SELECT bacsi.* , khoa.* FROM bacsi inner join khoa on bacsi.ChuyenMon = khoa.Id WHERE khoa.Id='` + id + `'`;
  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    res.render("xemkhoa", {
      listkhoa: data,
      un: req.session.username
    }); //nạp view và truyền dữ liệu cho view
  });
});

//Người dùng
app.get("/nguoidung", (req, res) => {
  let sql = `SELECT * FROM nguoidung`;

  let _tenND = req.query.txttimkiem;

  if (_tenND) {
    sql += " where TenDangNhap like '%" + _tenND + "%'";
  }

  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    res.render("nguoidung", { listnguoidung: data, un: req.session.username }); //nạp view và truyền dữ liệu cho view
  });
});

//Thêm người dùng
app.get("/themnguoidung", (req, res) => {
  res.render("themnguoidung", { un: req.session.username });
});
app.post("/themnguoidung", (req, res) => {
  let u = req.body.username;
  let p = req.body.password;
  let q = req.body.quyen;

  const bcrypt = require("bcrypt");
  var salt = bcrypt.genSaltSync(10);
  var pass_mahoa = bcrypt.hashSync(p, salt);

  let user_info = { TenDangNhap: u, MatKhau: pass_mahoa, Quyen: q };
  let sql = "INSERT INTO nguoidung SET ?";
  db.query(sql, user_info);
  res.redirect("/nguoidung");
});

//Bệnh án
app.get("/benhan", (req, res) => {
  let sql = `SELECT * 
  FROM benhan, benhnhan WHERE benhan.Id_BenhNhan = benhnhan.MaBenhNhan`;

  let _maBN = req.query.txttimkiem;

  if (_maBN) {
    sql += " where MaBenhNhan like '%" + _maBN + "%'";
  }

  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    res.render("benhan", { listbenhan: data, un: req.session.username }); //nạp view và truyền dữ liệu cho view
  });
});
//Thêm bệnh án
app.get("/thembenhan", (req, res) => {
  let sql = `SELECT * FROM benhnhan`;
  db.query(sql, function (err, data) {

    res.render("thembenhan", { listbenhan: data, un: req.session.username });
  })
});

app.post("/thembenhan", upload.single("Image"), (req, res) => {
  let id = req.body.Id;
  let idbn = req.body.Id_BenhNhan;
  // let dd = req.body.DuongDan;
  let file = req.file.filename;
  req.body.DuongDan = file;
  let tbv = req.body.TenBenhVien;
  let nnv = req.body.NgayNhapVien;

  let benhan_info = {
    Id: id,
    Id_BenhNhan: idbn,
    DuongDan: file,
    TenBenhVien: tbv,
    NgayNhapVien: nnv,
  };
  let sql = "INSERT INTO benhan SET ?";
  db.query(sql, benhan_info);
  res.redirect("/benhan");
});

//Xóa bệnh án
app.get("/xoabenhan", async (req, res) => {
  var id = req.query["id"];
  let sql = `DELETE FROM benhan WHERE Id='` + id + `'`;
  console.log(sql);
  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;

    res.redirect("/benhan");
  });
});

//Sửa bệnh án
app.get("/suabenhan", async (req, res) => {
  var id = req.query["id"];
  var id_benhnhan = req.query["id_benhnhan"];
  let sql = `SELECT * FROM benhan WHERE Id='` + id + `'`;

  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;

    res.render("suabenhan", { benhan: data[0], un: req.session.username }); //nạp view và truyền dữ liệu cho view
  });
});

app.post("/suabenhan", (req, res) => {
  var id = req.body.Id;
  var id_benhnhan = req.body.Id_BenhNhan;
  db.query(
    "update benhan SET Id_BenhNhan= ? where Id=?",
    [id_benhnhan, id],
    function (err, data) {
      if (err) throw err;
    }
  );
  res.redirect("/benhan");
});

//Thuốc
app.get("/thuoc", (req, res) => {
  let sql = `SELECT * FROM thuoc`;

  let _tenThuoc = req.query.txttimkiem;

  if (_tenThuoc) {
    sql += " where TenThuoc like '%" + _tenThuoc + "%'";
  }

  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    res.render("thuoc", { listthuoc: data, un: req.session.username }); //nạp view và truyền dữ liệu cho view
  });
});
//Thêm Thuốc
app.get("/themthuoc", (req, res) => {
  res.render("themthuoc", { un: req.session.username });
});

app.post("/themthuoc", (req, res) => {
  let id = req.body.Id;
  let tt = req.body.TenThuoc;
  let dv = req.body.DonVi;

  let thuoc_info = {
    Id: id,
    TenThuoc: tt,
    DonVi: dv,
  };
  let sql = "INSERT INTO thuoc SET ?";
  db.query(sql, thuoc_info);
  res.redirect("/thuoc");
});

//Xóa Thuốc
app.get("/xoathuoc", async (req, res) => {
  var id = req.query["id"];
  let sql = `DELETE FROM thuoc WHERE Id='` + id + `'`;
  console.log(sql);
  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;

    res.redirect("/thuoc");
  });
});

// Hiển thị danh sách lịch uống thuốc
app.get('/lichuongthuoc', (req, res) => {
  let sql = 'SELECT * FROM uongthuoc';
  db.query(sql, (err, data) => {
    if (err) throw err;
    res.render('lichuongthuoc', { listlichuongthuoc: data ,un: req.session.username});
  });
});

// Hiển thị chi tiết uống thuốc
app.get('/chitietuongthuoc/:id', (req, res) => {
  let id = req.params.id;
  let sql = `
    SELECT 
      thuoc.TenThuoc, 
      chitiet_uongthuoc.LieuLuong, 
      thuoc.DonVi 
    FROM 
      chitiet_uongthuoc 
    INNER JOIN 
      thuoc ON chitiet_uongthuoc.Id_Thuoc = thuoc.Id 
    WHERE 
      chitiet_uongthuoc.Id_UongThuoc = ?`;
  db.query(sql, [id], (err, data) => {
    if (err) throw err;
    res.render('chitiet_uongthuoc', { chitiet: data ,un: req.session.username});
  });
});

// Hiển thị trang thêm lịch uống thuốc
app.get('/themlichuongthuoc', (req, res) => {
  let sql = 'SELECT * FROM thuoc';
  db.query(sql, (err, data) => {
    if (err) throw err;
    res.render('themlichuongthuoc', { listthuoc: data ,un: req.session.username});
  });
});

// Xử lý thêm lịch uống thuốc
app.post('/themlichuongthuoc', (req, res) => {
  let { GioUong, NhacNho, Id_Thuoc, LieuLuong } = req.body;
  let id_BenhNhan = "BN001";  // Bạn có thể thay đổi giá trị này
  let id_BacSi = req.body.MaBacSi;    // Bạn có thể thay đổi giá trị này

  // Chèn dữ liệu vào bảng uongthuoc
  let uongthuoc_info = { GioUong, NhacNho, Id_BenhNhan: id_BenhNhan, Id_BacSi: id_BacSi };
  let sql_uongthuoc = 'INSERT INTO uongthuoc SET ?';
  db.query(sql_uongthuoc, uongthuoc_info, (err, result) => {
    if (err) throw err;

    // Lấy Id của bản ghi uongthuoc vừa chèn
    let id_UongThuoc = result.insertId;

    // Chèn dữ liệu vào bảng chitiet_uongthuoc
    let chitiet_arr = Id_Thuoc.map((idThuoc, index) => [idThuoc, id_UongThuoc, LieuLuong[index]]);
    let sql_chitiet = 'INSERT INTO chitiet_uongthuoc (Id_Thuoc, Id_UongThuoc, LieuLuong) VALUES ?';
    db.query(sql_chitiet, [chitiet_arr], (err, result) => {
      if (err) throw err;
      res.redirect('/lichuongthuoc');
    });
  });
});

// Xóa lịch uống thuốc
app.delete('/xoalichuongthuoc/:id', (req, res) => {
  let id = req.params.id;

  // Xóa dữ liệu từ bảng chitiet_uongthuoc trước
  let sql_chitiet = 'DELETE FROM chitiet_uongthuoc WHERE Id_UongThuoc = ?';
  db.query(sql_chitiet, [id], (err, result) => {
    if (err) throw err;

    // Sau khi xóa dữ liệu từ bảng chitiet_uongthuoc, xóa dữ liệu từ bảng uongthuoc
    let sql_uongthuoc = 'DELETE FROM uongthuoc WHERE Id = ?';
    db.query(sql_uongthuoc, [id], (err, result) => {
      if (err) throw err;
      res.send({ message: 'Xóa lịch uống thuốc thành công' });
    });
  });
});
// Lịch uống thuốc
// app.get("/lichuongthuoc", (req, res) => {
//   let sql = `
//     SELECT 
//       uongthuoc.Id AS UongThuocId, 
//       uongthuoc.NhacNho, 
//       uongthuoc.GioUong, 
//       benhnhan.TenBenhNhan, 
//       bacsi.TenBacSi, 
//       thuoc.TenThuoc, 
//       chitiet_uongthuoc.LieuLuong 
//     FROM 
//       uongthuoc
//     LEFT JOIN 
//       benhnhan ON uongthuoc.Id_BenhNhan = benhnhan.MaBenhNhan
//     LEFT JOIN 
//       bacsi ON uongthuoc.Id_BacSi = bacsi.MaBacSi
//     LEFT JOIN 
//       chitiet_uongthuoc ON uongthuoc.Id = chitiet_uongthuoc.Id_UongThuoc
//     LEFT JOIN 
//       thuoc ON chitiet_uongthuoc.Id_Thuoc = thuoc.Id`;

//   db.query(sql, function (err, data) {
//     if (err) throw err;
//     res.render("lichuongthuoc", { listlichuongthuoc: data, un: req.session.username });
//   });
// });


// Thêm Lịch Uống Thuốc
// app.get("/themlichuongthuoc", (req, res) => {
//   let sql = `SELECT * FROM thuoc, benhnhan`;
//   db.query(sql, function (err, data) {
//     if (err) throw err;
//     res.render("themlichuongthuoc", { listthuoc: data, un: req.session.username });
//   });
// });
// app.post("/themlichuongthuoc", (req, res) => {
//   // Thu thập dữ liệu từ request
//   let id = req.body.Id;
//   let id_Thuoc = req.body.TenThuoc;
//   let gioUong = req.body.GioUong;
//   let lieuLuong = req.body.LieuLuong;
//   let nhacNho = req.body.NhacNho;
//   let id_BenhNhan = 'BN001';  // Bạn có thể thay đổi giá trị này dựa trên logic của bạn
//   let id_BacSi = req.body.MaBacSi;     // Bạn có thể thay đổi giá trị này dựa trên logic của bạn

//   // Chèn dữ liệu vào bảng uongthuoc trước
//   let uongthuoc_info = {
//     Id: id,
//     NhacNho: nhacNho,
//     GioUong: gioUong,
//     Id_BenhNhan: id_BenhNhan,
//     Id_BacSi: id_BacSi
//   };

//   let sql_uongthuoc = "INSERT INTO uongthuoc SET ?";
//   db.query(sql_uongthuoc, uongthuoc_info, (err, result) => {
//     if (err) throw err;

//     // Lấy Id của bản ghi uongthuoc vừa chèn
//     let id_UongThuoc = result.insertId;

//     // Chèn dữ liệu vào bảng chitiet_uongthuoc
//     let chitiet_info = {
//       Id_Thuoc: id_Thuoc,
//       Id_UongThuoc: id_UongThuoc,
//       LieuLuong: lieuLuong
//     };

//     let sql_chitiet = "INSERT INTO chitiet_uongthuoc SET ?";
//     db.query(sql_chitiet, chitiet_info, (err, result) => {
//       if (err) throw err;
//       res.redirect("/lichuongthuoc");
//     });
//   });
// });


// Xóa lịch uống thuốc
// app.get("/xoalichuongthuoc", async (req, res) => {
//   var id = req.query["id"];

//   // Xoá dữ liệu trong bảng chitiet_uongthuoc trước
//   let sql_chitiet = `DELETE FROM chitiet_uongthuoc WHERE Id_UongThuoc='` + id + `'`;
//   db.query(sql_chitiet, function (err, data) {
//     if (err) throw err;

//     // Xoá dữ liệu trong bảng uongthuoc
//     let sql_uongthuoc = `DELETE FROM uongthuoc WHERE Id='` + id + `'`;
//     db.query(sql_uongthuoc, function (err, data) {
//       if (err) throw err;
//       res.redirect("/lichuongthuoc");
//     });
//   });
// });

//Xem Chi Tiết Lịch Uống Thuốc
// app.get("/xemchitietlichuongthuoc", async (req, res) => {
//   var id = req.query["id"];
//   let sql = 'SELECT * FROM chitiet_uongthuoc WHERE Id=?';
//   console.log(sql);
//   db.query(sql, function (err, data) {
//     // biến data chứa kết quả truy vấn
//     if (err) throw err;

//     res.render("xembacsi", {
//       chitiet_uongthuoc: data,
//       un: req.session.username,
//     }); //nạp view và truyền dữ liệu cho view
//   });
// });

//Phân công
app.get("/phancong", (req, res) => {
  let sql = `SELECT * FROM bacsi, benhnhan WHERE benhnhan.MaBacSi=bacsi.MaBacSi`;
  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    res.render("phancong", { listphancong: data, un: req.session.username }); //nạp view và truyền dữ liệu cho view
  });
});

//Sửa phân công
app.get("/suaphancong", async (req, res) => {
  var mabenhnhan = req.query["mabenhnhan"];
  var mabacsi = req.query["mabacsi"];
  let sql = `SELECT * FROM bacsi`;
  console.log(sql);

  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;

    res.render("suaphancong", {
      listbacsi: data,
      mabenhnhan: mabenhnhan,
      mabacsi: mabacsi,
      un: req.session.username,
    }); //nạp view và truyền dữ liệu cho view
  });
});

app.post("/suaphancong", (req, res) => {
  //console.log(req.body.MaBacSi);
  var mabenhnhan = req.body.MaBenhNhan;
  var mabacsi = req.body.MaBacSi;
  db.query(
    "update benhnhan SET MaBacSi= ? where MaBenhNhan=?",
    [mabacsi, mabenhnhan],
    function (err, data) {
      if (err) throw err;
    }
  );
  res.redirect("/phancong");
});

//Bệnh Nhân
app.get('/benhnhan', (req, res) => {
  let sql = `SELECT * FROM benhnhan, bacsi WHERE benhnhan.MaBacSi = bacsi.MaBacSi`;

  let _maBN = req.query.txttimkiem;

  if (_maBN) {
    sql += " where MaBenhNhan like '%" + _maBN + "%'";
  }

  db.query(sql, async function (err, databenhnhan) { // biến data chứa kết quả truy vấn
    if (err) throw err;

    let tuoi = 0;

    for (let [index, benhnhan] of databenhnhan.entries()) {

      var yyyy = benhnhan.NgaySinh.getFullYear();
      const currentYear = new Date().getFullYear();
      tuoi = currentYear - yyyy;
    }
    res.render('benhnhan', { listbenhnhan: databenhnhan, un: req.session.username, age: tuoi }); //nạp view và truyền dữ liệu cho view
  });
})

//Xem thông tin bệnh nhân
app.get('/xem', async (req, res) => {
  var mabenhnhan = req.query['mabenhnhan'];

  let sql =
    `SELECT * FROM benhnhan, vitri_benhnhan WHERE MaBenhNhan='` +
    mabenhnhan +
    `' and benhnhan.MaBenhNhan = vitri_benhnhan.Id_BenhNhan`;
  // console.log(sql);
  db.query(sql, async function (err, databenhnhan) { // biến data chứa kết quả truy vấn
    if (err) throw err;

    var yyyy = databenhnhan[0].NgaySinh.getFullYear();
    var dd = databenhnhan[0].NgaySinh.getDate();
    var mm = databenhnhan[0].NgaySinh.getMonth() + 1;
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const currentYear = new Date().getFullYear()
    tuoi = currentYear - yyyy;
    const formattedToday = dd + "/" + mm + "/" + yyyy;

    res.render('xem', { sinh: formattedToday, benhnhan: databenhnhan[0], un: req.session.username });
  });

})

//Sửa bệnh nhân
app.get("/suabenhnhan", async (req, res) => {
  var mabenhnhan = req.query["mabenhnhan"];
  let sql = `SELECT * FROM benhnhan WHERE MaBenhNhan='` + mabenhnhan + `'`;
  console.log(sql);

  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    console.log(data[0].NgaySinh.getFullYear());
    var yyyy = data[0].NgaySinh.getFullYear();
    var dd = data[0].NgaySinh.getDate();
    var mm = data[0].NgaySinh.getMonth() + 1;
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = yyyy + "-" + mm + "-" + dd;
    console.log(formattedToday);
    res.render("suabenhnhan", {
      benhnhan: data[0],
      un: req.session.username,
      sinh: formattedToday,
    }); //nạp view và truyền dữ liệu cho view
  });
});

app.post("/suabenhnhan", (req, res) => {
  var mabenhnhan = req.body.MaBenhNhan;
  db.query(
    "update benhnhan SET ? where MaBenhNhan=?",
    [req.body, mabenhnhan],
    function (err, data) {
      if (err) throw err;
    }
  );
  res.redirect("/benhnhan");
});

//Xóa bệnh nhân
app.get("/xoabenhnhan", async (req, res) => {
  var mabenhnhan = req.query["mabenhnhan"];
  let sql = `DELETE FROM nguoidung WHERE TenDangNhap='` + mabenhnhan + `'`;
  console.log(sql);
  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    let sql = `DELETE FROM benhnhan WHERE MaBenhNhan='` + mabenhnhan + `'`;
    console.log(sql);
    db.query(sql, function (err, data) {
      // biến data chứa kết quả truy vấn
      if (err) throw err;

      res.redirect("/benhnhan");
    });
  });
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

//Trang chủ
app.get("/", (req, res) => {
  if (req.session.daDangNhap) {
    if (req.session.quyen == 1)
      res.render("index", { un: req.session.username });
    else if (req.session.quyen == 2) res.redirect("/benhnhan_bacsi");
    else res.redirect("/hosobenhnhan");
  } else res.redirect("/dangnhap");
});

//Hồ sơ bệnh nhân
app.get("/hosobenhnhan", (req, res) => {
  let mabenhnhan = req.session.username;
  let tuoi = 0;
  let sql = `SELECT * FROM benhnhan WHERE MaBenhNhan='` + mabenhnhan + `'`;
  console.log(sql);
  db.query(sql, async function (err, databenhnhan) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;

    var yyyy = databenhnhan[0].NgaySinh.getFullYear();
    var dd = databenhnhan[0].NgaySinh.getDate();
    var mm = databenhnhan[0].NgaySinh.getMonth() + 1;
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    const currentYear = new Date().getFullYear();
    tuoi = currentYear - yyyy;

    const formattedToday = dd + "/" + mm + "/" + yyyy;
    var dulieu = [
      [tuoi, databenhnhan[0].CanNang],
    ];
    console.log(dulieu);

    res.render("hosobenhnhan", {
      sinh: formattedToday,
      benhnhan: databenhnhan[0],
      un: req.session.username
    }); //nạp view và truyền dữ liệu cho view
  });
});

//Hỏi đáp bệnh nhân
app.get("/hoidap_benhnhan", (req, res) => {
  res.render("hoidap_benhnhan", { un: req.session.username });
});
app.post("/hoidap_benhnhan", (req, res) => {
  let u = req.body.Id_BenhNhan;
  let n = req.body.NoiDung;
  var today = new Date();
  var d =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  let user_info = { Id_BenhNhan: u, NoiDung: n, NgayDang: d, TinhTrang: "0" };
  let sql = "INSERT INTO hoidap_benhnhan SET ?";
  db.query(sql, user_info);
  res.redirect("/hosobenhnhan");
});

//Danh sách bệnh nhân của bác sĩ
app.get("/benhnhan_bacsi", (req, res) => {
  let mabacsi = req.session.username;
  let sql =
    `SELECT MaBenhNhan, TenBenhNhan, CanNang, benhnhan.NgaySinh FROM benhnhan, bacsi WHERE benhnhan.MaBacSi='` +
    mabacsi +
    `' AND benhnhan.MaBacSi=bacsi.MaBacSi`;

  let _maBNBS = req.query.txttimkiem;

  if (_maBNBS) {
    sql += " AND MaBenhNhan like '%" + _maBNBS + "%'";
  }

  db.query(sql, async function (err, databenhnhan) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;

    for (let [index, benhnhan] of databenhnhan.entries()) {
      var mabenhnhan = benhnhan.MaBenhNhan;

      var yyyy = benhnhan.NgaySinh.getFullYear();
      const currentYear = new Date().getFullYear();
      tuoi = currentYear - yyyy;

      var dulieu = [
        [tuoi, benhnhan.CanNang],
      ];
      console.log(dulieu);
    }
    res.render("benhnhan_bacsi", {
      listbenhnhan: databenhnhan,
      un: req.session.username
    });
    console.log(databenhnhan);
  });
});

//xem bệnh nhân - bác sĩ
app.get("/xembenhnhanbacsi", async (req, res) => {
  var mabenhnhan = req.query["mabenhnhan"];
  console.log(mabenhnhan);
  let sql =
    `SELECT * FROM benhnhan, vitri_benhnhan WHERE MaBenhNhan='` +
    mabenhnhan +
    `' and benhnhan.MaBenhNhan = vitri_benhnhan.Id_BenhNhan`;
  console.log(sql);
  db.query(sql, async function (err, databenhnhan) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;

    var yyyy = databenhnhan[0].NgaySinh.getFullYear();
    var dd = databenhnhan[0].NgaySinh.getDate();
    var mm = databenhnhan[0].NgaySinh.getMonth() + 1;
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    const currentYear = new Date().getFullYear();
    tuoi = currentYear - yyyy;
    const formattedToday = dd + "/" + mm + "/" + yyyy;

    res.render("xembenhnhanbacsi", {
      NgaySinh: formattedToday,
      benhnhan: databenhnhan[0],
      un: req.session.username
    });
  });
});

app.get("/hoidap_bacsi", (req, res) => {
  let mabacsi = req.session.username;
  let sql =
    `SELECT * FROM hoidap_benhnhan, benhnhan WHERE hoidap_benhnhan.Id_BenhNhan=benhnhan.MaBenhNhan AND hoidap_benhnhan.TinhTrang=0 AND benhnhan.MaBacSi='` +
    mabacsi +
    `'`;

  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    res.render("hoidap_bacsi", { listhoi: data, un: req.session.username }); //nạp view và truyền dữ liệu cho view
  });
});

//Phản hồi
app.get("/phanhoi", (req, res) => {
  //let id_hoi = req.query['id_hoi'];
  //console.log('Nội dung: '+req.query['noidung'])
  res.render("phanhoi", {
    un: req.session.username,
    id_hoi: req.query["id_hoi"],
    noidung: req.query["noidung"],
  });
});
app.post("/phanhoi", (req, res) => {
  let i = req.body.ID_hoi;
  let n = req.body.NoiDung;

  let user_info = { ID_hoi: i, NoiDung: n };
  let sql = "INSERT INTO phanhoi SET ?";
  db.query(sql, user_info);
  db.query(
    "update hoidap_benhnhan SET TinhTrang='1' where Id=?",
    [i],
    function (err, data) {
      if (err) throw err;
      res.redirect("/hoidap_bacsi");
    }
  );
});

//Xem phản hồi
app.get("/xemphanhoi", (req, res) => {
  let mabenhnhan = req.session.username;
  console.log(mabenhnhan);

  let sql =
    `SELECT hoidap_benhnhan.NoiDung AS cauhoi, phanhoi.NoiDung AS phanhoi FROM hoidap_benhnhan, phanhoi WHERE hoidap_benhnhan.Id_BenhNhan='` +
    mabenhnhan +
    `' AND hoidap_benhnhan.Id=phanhoi.ID_hoi AND hoidap_benhnhan.TinhTrang='1'`;

  db.query(sql, function (err, data) {
    // biến data chứa kết quả truy vấn
    if (err) throw err;
    res.render("xemphanhoi", { listhoidap: data, un: req.session.username }); //nạp view và truyền dữ liệu cho view
  });
});

//Đăng nhập
app.get("/dangnhap", function (req, res) {
  res.render("dangnhap.ejs");
});
//Xử lý đăng nhập
app.post("/dangnhap", function (req, res) {
  let u = req.body.username;
  console.log(u);
  let p = req.body.password;
  console.log(p);
  let sql = "SELECT * FROM nguoidung WHERE TenDangNhap = ?";
  db.query(sql, [u], (err, rows) => {
    if (rows.length <= 0) {
      console.log("Not OK");
      res.redirect("/dangnhap");
      return;
    }
    let user = rows[0];
    let pass_fromdb = user.MatKhau;
    const bcrypt = require("bcrypt");
    var kq = bcrypt.compareSync(p, pass_fromdb);
    if (kq) {
      console.log("OK");
      var sess = req.session; //initialize session variable
      sess.daDangNhap = true;
      sess.username = user.TenDangNhap;
      sess.quyen = user.Quyen;
      res.redirect("/");
    } else {
      console.log("Not OK");
      res.redirect("/dangnhap");
    }
  });
});

//Thoát
app.get("/thoat", function (req, res) {
  req.session.destroy();
  res.redirect("/dangnhap");
});

app.listen(port, () => console.log("SERVER IS LISTENNING"));
