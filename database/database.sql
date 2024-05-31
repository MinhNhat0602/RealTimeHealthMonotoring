-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 23, 2024 at 07:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanlysuckhoe`
--
DROP DATABASE IF EXISTS `quanlysuckhoe`;
CREATE DATABASE IF NOT EXISTS `quanlysuckhoe`DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `quanlysuckhoe`;
-- --------------------------------------------------------

--
-- Table structure for table `bacsi`
--

CREATE TABLE `bacsi` (
  `MaBacSi` varchar(255) NOT NULL,
  `TenBacSi` varchar(255) NOT NULL,
  `NgaySinh` date NOT NULL,
  `SoDienThoai` varchar(10) NOT NULL,
  `Mail` varchar(255) NOT NULL,
  `ChuyenMon` int(11) DEFAULT NULL,
  `GioiTinh` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bacsi`
--

INSERT INTO `bacsi` (`MaBacSi`, `TenBacSi`, `NgaySinh`, `SoDienThoai`, `Mail`, `ChuyenMon`, `GioiTinh`) VALUES
('BS001', 'Trần Văn Khôi', '1988-02-01', '0789171899', 'tranvankhoi@gmail.com', 1, 'Nam'),
('BS002', 'Lê Thị Thảo', '1991-12-02', '0932860481', 'thao@gmail.com', 2, 'Nữ'),
('BS005', 'Trần Văn A', '2000-08-11', '1234567890', 'Tva@gmail.com', 3, 'Nam');
-- --------------------------------------------------------

--
-- Table structure for table `benhan`
--

CREATE TABLE `benhan` (
  `Id` int(11) NOT NULL,
  `Id_BenhNhan` varchar(255) DEFAULT NULL,
  `DuongDan` varchar(255) DEFAULT NULL,
  `TenBenhVien` varchar(255) DEFAULT NULL,
  `NgayNhapVien` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `benhan`
--

INSERT INTO `benhan` (`Id`, `Id_BenhNhan`, `DuongDan`, `TenBenhVien`, `NgayNhapVien`) VALUES
(1, 'BN001', 'TriTueNhanTao.pdf', 'Bệnh Viện Đa Khoa An Giang', '2024-04-05');
-- --------------------------------------------------------

--
-- Table structure for table `benhnhan`
--

CREATE TABLE `benhnhan` (
  `MaBenhNhan` varchar(255) NOT NULL,
  `TenBenhNhan` varchar(255) NOT NULL,
  `NgaySinh` date NOT NULL,
  `SoDienThoai` varchar(10) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `SoDienThoaiNguoiThan` varchar(10) NOT NULL,
  `DiaChi` varchar(255) NOT NULL,
  `GioiTinh` varchar(10) NOT NULL,
  `CanNang` float NOT NULL,
  `MaBacSi` varchar(255) NOT NULL,
  `Avatar` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `benhnhan`
--

INSERT INTO `benhnhan` (`MaBenhNhan`, `TenBenhNhan`, `NgaySinh`, `SoDienThoai`, `Email`, `SoDienThoaiNguoiThan`, `DiaChi`, `GioiTinh`, `CanNang`, `MaBacSi`, `Avatar`) VALUES
('BN001', 'Nguyễn Thị Ngọc', '1991-01-02', '0978981234', 'ngoc@gmail.com', '0937899789', 'Long Xuyên, An Giang', 'Nữ', 65, 'BS001', '1681843722484.png'),
('BN002', 'Phan Quang Thái', '2002-03-23', '0583929495', 'pqthat@gmail.com', '0384756372', 'Chi Lăng', 'Nam', 65, 'BS001', '1713335508819.png'),
('BN003', 'Nguyễn Khánh Duy Tâm', '2002-02-23', '0708264834', 'nguyenkhanhduytam@gmail.com', '0708264885', 'Phú Tân', 'Nam', 55, 'BS001', '1713337536836.png');

-- --------------------------------------------------------

--
-- Table structure for table `chisosuckhoe`
--

CREATE TABLE `chisosuckhoe` (
  `Id` int(11) NOT NULL,
  `MaBenhNhan` varchar(255) DEFAULT NULL,
  `NhipTim` float DEFAULT NULL,
  `SpO2` float DEFAULT NULL,
  `HATThu` float DEFAULT NULL,
  `HATTRUONG` float DEFAULT NULL,
  `NgayNhan` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chitiet_uongthuoc`
--

CREATE TABLE `chitiet_uongthuoc` (
  `Id` int(11) NOT NULL,
  `Id_Thuoc` int(11) DEFAULT NULL,
  `LieuLuong` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hoidap_benhnhan`
--

CREATE TABLE `hoidap_benhnhan` (
  `Id` int(11) NOT NULL,
  `Id_BenhNhan` varchar(255) NOT NULL,
  `NoiDung` text NOT NULL,
  `NgayDang` date NOT NULL,
  `TinhTrang` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hoidap_benhnhan`
--

INSERT INTO `hoidap_benhnhan` (`Id`, `Id_BenhNhan`, `NoiDung`, `NgayDang`, `TinhTrang`) VALUES
(1, 'BN001', 'Xin chào, tôi có thể đặt 1 câu hỏi về sức khỏe hiện nay được không? Hiện nay tui đang gặp 1 số vấn về về hô hấp. Bác sĩ có thể giúp tôi một vài lới khuyên được không', '2023-04-19', 1),
(2, 'BN001', 'xin chào tôi muốn hỏi\r\n', '2023-06-19', 0),
(3, 'BN001', 'xin chào tôi muốn hỏi\r\n', '2023-06-19', 0),
(4, 'BN001', 'HHHHHHHHHHHHHHHHH', '2024-03-23', 1),
(5, 'BN001', 'Dạ em chào bác sĩ', '2024-04-18', 0);
-- --------------------------------------------------------

--
-- Table structure for table `khoa`
--

CREATE TABLE `khoa` (
  `Id` int(11) NOT NULL,
  `TenKhoa` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `khoa`
--

INSERT INTO `khoa` (`Id`, `TenKhoa`) VALUES
(1, 'Khoa Nội'),
(2, 'Khoa Ngoại'),
(3, 'Khoa Phụ Sản'),
(4, 'Khoa Nhi'),
(5, 'Khoa Cấp Cứu'),
(6, 'Khoa Răng Hàm Mặt');
-- --------------------------------------------------------

--
-- Table structure for table `nguoidung`
--

CREATE TABLE `nguoidung` (
  `Id` int(11) NOT NULL,
  `TenDangNhap` varchar(255) NOT NULL,
  `MatKhau` text NOT NULL,
  `Quyen` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nguoidung`
--

INSERT INTO `nguoidung` (`Id`, `TenDangNhap`, `MatKhau`, `Quyen`) VALUES
(1, 'admin1', '$2b$10$kxveS/MI7sYSQA38eSqf1OBBIxGy0nw6FFouT4OYTMq2dJAYIIaYO', 1),
(2, 'BS001', '$2b$10$ik0EuwnjjSGG3s.4wQgzpe4alFwg/GPGVehkuRCQ8B.4pfcwz5aGi', 2),
(3, 'BS002', '$2b$10$cek/Ke2v4t2SChmwDmoKBe7aovwDTEsFMDh4KfChaNtEB9EQybuZK', 2),
(4, 'BN001', '$2b$10$D5WYbrVztp0yfcJo96Ad0uA/6sWQi..2t3we6nIHGnLPLrLFFNwWS', 3),
(5, 'BN002', '$2a$12$VCyp79Ena7Lgh6WMwGfW2.SdijcgXn4Hpjbe1uyKmsRMQDOj5lgQW', 3),
(7, 'BN003', '$2b$10$VN3Bnd4LvYTq2anpdNxMG.zSxP8JTrQ00PzoSVQH2.mKVjJcAZ1SC', 3);
-- --------------------------------------------------------

--
-- Table structure for table `phanhoi`
--

CREATE TABLE `phanhoi` (
  `ID` int(11) NOT NULL,
  `ID_hoi` int(11) NOT NULL,
  `NoiDung` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `phanhoi`
--

INSERT INTO `phanhoi` (`ID`, `ID_hoi`, `NoiDung`) VALUES
(1, 1, 'Cảm ơn bạn đã đặt câu hỏi, tôi xin phép trả lời như sao:\r\nĐầu tiên về vấn đề sức khỏe của bạn\r\nTiếp theo là về các vấn đề khác'),
(2, 4, 'Cảm ơn bạn');
-- --------------------------------------------------------

--
-- Table structure for table `thuoc`
--

CREATE TABLE `thuoc` (
  `Id` int(11) NOT NULL,
  `TenThuoc` varchar(255) DEFAULT NULL,
  `DonVi` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `uongthuoc`
--

CREATE TABLE `uongthuoc` (
  `Id` int(11) NOT NULL,
  `NhacNho` varchar(255) DEFAULT NULL,
  `GioUong` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Id_BenhNhan` varchar(255) DEFAULT NULL,
  `Id_Bacsi` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vitri_benhnhan`
--

CREATE TABLE `vitri_benhnhan` (
  `Id` int(11) NOT NULL,
  `Id_BenhNhan` varchar(255) DEFAULT NULL,
  `Lat` decimal(9,6) DEFAULT NULL,
  `Long` decimal(9,6) DEFAULT NULL,
  `DiaChi` varchar(255) DEFAULT NULL,
  `ThoiGian` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vitri_benhnhan`
--

INSERT INTO `vitri_benhnhan` (`Id`, `Id_BenhNhan`, `Lat`, `Long`, `DiaChi`, `ThoiGian`) VALUES
(1, 'BN002', 10.373743, 105.433695, 'An Giang', '2024-04-17 06:42:08'),
(2, 'BN001', 10.373743, 105.489525, 'aâ', '2024-04-17 06:44:07'),
(3, 'BN003', NULL, NULL, NULL, '2024-04-17 07:05:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bacsi`
--
ALTER TABLE `bacsi`
  ADD PRIMARY KEY (`MaBacSi`),
  ADD KEY `ChuyenMon` (`ChuyenMon`);

--
-- Indexes for table `benhan`
--
ALTER TABLE `benhan`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `benhan_ibfk_1` (`Id_BenhNhan`);

--
-- Indexes for table `benhnhan`
--
ALTER TABLE `benhnhan`
  ADD PRIMARY KEY (`MaBenhNhan`),
  ADD KEY `MaBacSi` (`MaBacSi`);

--
-- Indexes for table `chisosuckhoe`
--
ALTER TABLE `chisosuckhoe`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `chisosuckhoe_ibfk_1` (`MaBenhNhan`);

--
-- Indexes for table `chitiet_uongthuoc`
--
ALTER TABLE `chitiet_uongthuoc`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id_Thuoc` (`Id_Thuoc`);

--
-- Indexes for table `hoidap_benhnhan`
--
ALTER TABLE `hoidap_benhnhan`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Hoi_FK_BN` (`Id_BenhNhan`);

--
-- Indexes for table `khoa`
--
ALTER TABLE `khoa`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `phanhoi`
--
ALTER TABLE `phanhoi`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `PH_FK_HD` (`ID_hoi`);

--
-- Indexes for table `thuoc`
--
ALTER TABLE `thuoc`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `uongthuoc`
--
ALTER TABLE `uongthuoc`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `uongthuoc_ibfk_1` (`Id_BenhNhan`),
  ADD KEY `uongthuoc_ibfk_2` (`Id_Bacsi`);

--
-- Indexes for table `vitri_benhnhan`
--
ALTER TABLE `vitri_benhnhan`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `vitri_benhnhan_ibfk_1` (`Id_BenhNhan`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `benhan`
--
ALTER TABLE `benhan`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chitiet_uongthuoc`
--
ALTER TABLE `chitiet_uongthuoc`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hoidap_benhnhan`
--
ALTER TABLE `hoidap_benhnhan`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `khoa`
--
ALTER TABLE `khoa`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `phanhoi`
--
ALTER TABLE `phanhoi`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `thuoc`
--
ALTER TABLE `thuoc`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `uongthuoc`
--
ALTER TABLE `uongthuoc`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vitri_benhnhan`
--
ALTER TABLE `vitri_benhnhan`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bacsi`
--
ALTER TABLE `bacsi`
  ADD CONSTRAINT `bacsi_ibfk_1` FOREIGN KEY (`ChuyenMon`) REFERENCES `khoa` (`Id`);

--
-- Constraints for table `benhan`
--
ALTER TABLE `benhan`
  ADD CONSTRAINT `benhan_ibfk_1` FOREIGN KEY (`Id_BenhNhan`) REFERENCES `benhnhan` (`MaBenhNhan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `benhnhan`
--
ALTER TABLE `benhnhan`
  ADD CONSTRAINT `benhnhan_ibfk_1` FOREIGN KEY (`MaBacSi`) REFERENCES `bacsi` (`MaBacSi`);

--
-- Constraints for table `chisosuckhoe`
--
ALTER TABLE `chisosuckhoe`
  ADD CONSTRAINT `chisosuckhoe_ibfk_1` FOREIGN KEY (`MaBenhNhan`) REFERENCES `benhnhan` (`MaBenhNhan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chitiet_uongthuoc`
--
ALTER TABLE `chitiet_uongthuoc`
  ADD CONSTRAINT `chitiet_uongthuoc_ibfk_1` FOREIGN KEY (`Id_Thuoc`) REFERENCES `thuoc` (`Id`);

--
-- Constraints for table `hoidap_benhnhan`
--
ALTER TABLE `hoidap_benhnhan`
  ADD CONSTRAINT `Hoi_FK_BN` FOREIGN KEY (`Id_BenhNhan`) REFERENCES `benhnhan` (`MaBenhNhan`);

--
-- Constraints for table `phanhoi`
--
ALTER TABLE `phanhoi`
  ADD CONSTRAINT `PH_FK_HD` FOREIGN KEY (`ID_hoi`) REFERENCES `hoidap_benhnhan` (`Id`);

--
-- Constraints for table `uongthuoc`
--
ALTER TABLE `uongthuoc`
  ADD CONSTRAINT `uongthuoc_ibfk_1` FOREIGN KEY (`Id_BenhNhan`) REFERENCES `benhnhan` (`MaBenhNhan`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `uongthuoc_ibfk_2` FOREIGN KEY (`Id_Bacsi`) REFERENCES `bacsi` (`MaBacSi`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vitri_benhnhan`
--
ALTER TABLE `vitri_benhnhan`
  ADD CONSTRAINT `vitri_benhnhan_ibfk_1` FOREIGN KEY (`Id_BenhNhan`) REFERENCES `benhnhan` (`MaBenhNhan`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
