-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2025 at 12:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `emeraldsrx_hrm`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance_logs`
--

CREATE TABLE `attendance_logs` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `shiftAssignmentId` varchar(36) DEFAULT NULL,
  `clockIn` datetime NOT NULL,
  `clockOut` datetime DEFAULT NULL,
  `ipAddress` varchar(50) DEFAULT NULL,
  `deviceInfo` varchar(255) DEFAULT NULL,
  `isLate` tinyint(1) DEFAULT 0,
  `isNoShow` tinyint(1) DEFAULT 0,
  `totalHours` decimal(5,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance_logs`
--

INSERT INTO `attendance_logs` (`id`, `employeeId`, `shiftAssignmentId`, `clockIn`, `clockOut`, `ipAddress`, `deviceInfo`, `isLate`, `isNoShow`, `totalHours`, `notes`, `createdAt`, `updatedAt`) VALUES
('038d99f4-a671-4cf6-ace0-4d6fdac0a3b4', '6c449300-9476-4916-9550-b3760ab9ab1b', NULL, '2025-11-10 06:11:46', '2025-11-10 15:11:46', NULL, NULL, 0, 0, 8.24, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('06373920-bbde-44f3-92c4-5cf53ba36ae1', '6c449300-9476-4916-9550-b3760ab9ab1b', NULL, '2025-11-20 16:45:46', '2025-11-21 00:45:46', NULL, NULL, 0, 0, 8.16, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('17782f7a-8318-4b75-9988-a77c2613f96b', '57b017b3-7414-4014-b107-3a588834d289', NULL, '2025-11-02 07:10:06', '2025-11-02 15:10:06', NULL, NULL, 0, 0, 8.10, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('1a4e91cd-1a4d-4dad-ad02-d576d109053e', '8abcab26-c588-4ca3-be20-a68ea71759e9', NULL, '2025-11-25 18:48:55', '2025-11-26 02:48:55', NULL, NULL, 0, 0, 8.08, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('1cc583a7-7207-4321-936f-269be6592830', '8abcab26-c588-4ca3-be20-a68ea71759e9', NULL, '2025-11-06 00:19:45', '2025-11-06 09:19:45', NULL, NULL, 0, 0, 7.90, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('1d02da61-e80d-4fa3-bcaf-395b4ceadb99', '0788868b-90aa-43db-aa00-7b080c3fc3bc', NULL, '2025-11-07 02:47:16', '2025-11-07 11:47:16', NULL, NULL, 1, 0, 8.23, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('1e3487ae-35e9-4b56-be8a-d8bcb890a4fd', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-23 23:37:22', '2025-11-24 08:37:22', NULL, NULL, 0, 0, 8.11, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('23b3d7dc-f206-4022-89c6-e3393b3a25f7', '57b017b3-7414-4014-b107-3a588834d289', NULL, '2025-11-21 22:37:52', '2025-11-22 07:37:52', NULL, NULL, 0, 0, 8.07, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('2ac354b3-1fb5-4b6b-b72b-53963be9e78c', '6c449300-9476-4916-9550-b3760ab9ab1b', NULL, '2025-11-27 10:32:56', '2025-11-27 18:32:56', NULL, NULL, 0, 0, 7.79, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('2ea4930d-5c67-4af0-952c-f299991aaddc', '8abcab26-c588-4ca3-be20-a68ea71759e9', NULL, '2025-11-04 23:01:38', '2025-11-05 07:01:38', NULL, NULL, 0, 0, 8.23, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('34d5e3cb-0355-4279-9ef8-7731cb0a4023', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-11-01 18:25:50', '2025-11-02 03:25:50', NULL, NULL, 1, 0, 8.11, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('357fa5a6-30eb-403d-a584-d15ebbac013e', '0788868b-90aa-43db-aa00-7b080c3fc3bc', NULL, '2025-10-30 00:33:29', '2025-10-30 09:33:29', NULL, NULL, 1, 0, 8.02, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('37c95549-91f2-42ee-8872-f485e97a470e', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-07 18:53:45', '2025-11-08 03:53:45', NULL, NULL, 0, 0, 8.01, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('3ccc4ca0-341d-4212-af05-8e9bd1a0c632', '6c449300-9476-4916-9550-b3760ab9ab1b', NULL, '2025-11-04 00:57:52', '2025-11-04 09:57:52', NULL, NULL, 0, 0, 7.78, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('3d19a378-8e80-4fd1-885a-48017a4401e5', '6c449300-9476-4916-9550-b3760ab9ab1b', NULL, '2025-11-07 11:20:17', '2025-11-07 20:20:17', NULL, NULL, 0, 0, 7.98, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('3d8fdbe9-34ee-4cd8-8d37-bfb19f7b22eb', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-11 00:32:33', '2025-11-11 09:32:33', NULL, NULL, 1, 0, 7.94, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('41b59464-49b8-46a4-aaf4-be3394984671', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-03 06:58:14', '2025-11-03 15:58:14', NULL, NULL, 0, 0, 7.96, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('49bd9210-d829-4eb6-add6-5668d32aadbb', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-11-10 15:57:45', '2025-11-10 23:57:45', NULL, NULL, 0, 0, 8.03, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('4ff4c287-7bde-482f-bf09-93b25eaa6b13', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-11 08:49:18', '2025-11-11 17:49:18', NULL, NULL, 0, 0, 8.14, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('56d2e2a5-6fbe-42c0-8568-1ac85d4ae554', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-11-23 01:12:13', '2025-11-23 10:12:13', NULL, NULL, 0, 0, 7.99, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('574c26cc-37a9-4193-8d9c-b2499d3e740c', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-02 06:31:52', '2025-11-02 15:31:52', NULL, NULL, 1, 0, 7.87, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('5effb1c7-d03a-4e46-894b-310a054fe686', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-21 22:22:36', '2025-11-22 06:22:36', NULL, NULL, 0, 0, 7.82, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('66359e9f-f1a0-4656-a1a4-ad823cedb147', '6c449300-9476-4916-9550-b3760ab9ab1b', NULL, '2025-11-06 05:58:10', '2025-11-06 13:58:10', NULL, NULL, 0, 0, 7.84, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('67d4ad59-dbe1-4d65-8c3b-d955dcc4704c', '8abcab26-c588-4ca3-be20-a68ea71759e9', NULL, '2025-11-08 10:56:59', '2025-11-08 18:56:59', NULL, NULL, 0, 0, 8.18, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('6cddffa7-7697-4636-a24e-05248df1b88a', '8abcab26-c588-4ca3-be20-a68ea71759e9', NULL, '2025-11-21 01:39:52', '2025-11-21 09:39:52', NULL, NULL, 0, 0, 8.24, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('7a340576-567a-4f06-9a62-55a967e64c9e', '0788868b-90aa-43db-aa00-7b080c3fc3bc', NULL, '2025-11-15 09:41:19', '2025-11-15 18:41:19', NULL, NULL, 0, 0, 7.87, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('7a90ce88-6bba-4a88-b6a2-abe8cccbd72a', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-11-23 12:07:45', '2025-11-23 20:07:45', NULL, NULL, 0, 0, 8.16, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('7b90a9a2-fe47-4661-b2c9-95a209b747c5', '57b017b3-7414-4014-b107-3a588834d289', NULL, '2025-11-15 22:08:04', '2025-11-16 06:08:04', NULL, NULL, 0, 0, 7.87, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('809e93fb-1e83-4ba3-85f6-0e06d53332ff', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-13 01:24:00', '2025-11-13 09:24:00', NULL, NULL, 0, 0, 7.97, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('8c49a13f-0599-4966-b2db-08a9076c2a1f', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-26 08:43:42', '2025-11-26 16:43:42', NULL, NULL, 0, 0, 7.89, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('8ce6b66f-3e8a-4d55-86b1-4bf57f7f1f38', '6c449300-9476-4916-9550-b3760ab9ab1b', NULL, '2025-11-01 00:39:45', '2025-11-01 08:39:45', NULL, NULL, 0, 0, 8.16, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('8f56f6f9-b647-4731-9b44-51d47de5fe32', '8abcab26-c588-4ca3-be20-a68ea71759e9', NULL, '2025-11-06 03:58:45', '2025-11-06 11:58:45', NULL, NULL, 1, 0, 8.18, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('8fc7c5bb-f3b8-4fd1-a91b-5dda4251bfb5', '6c449300-9476-4916-9550-b3760ab9ab1b', NULL, '2025-11-05 09:01:47', '2025-11-05 18:01:47', NULL, NULL, 0, 0, 8.01, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('9337c2a4-1dc1-4418-b653-b3a98dba5cbd', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-10-31 23:17:34', '2025-11-01 08:17:34', NULL, NULL, 0, 0, 8.19, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('98c33e57-b000-4e60-9b85-2edee481572f', '8abcab26-c588-4ca3-be20-a68ea71759e9', NULL, '2025-11-25 14:48:00', '2025-11-25 22:48:00', NULL, NULL, 0, 0, 7.96, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('a49a8798-17f2-4811-b266-81f3a626b46d', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-05 05:21:15', '2025-11-05 14:21:15', NULL, NULL, 0, 0, 8.15, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('a9735e13-5d71-4595-8a7a-9bff0dd9c594', '8abcab26-c588-4ca3-be20-a68ea71759e9', NULL, '2025-11-27 10:16:33', '2025-11-27 19:16:33', NULL, NULL, 0, 0, 8.02, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('ad294c88-8a9f-4f22-8d29-f4821f76a5fa', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-11-16 18:01:07', '2025-11-17 02:01:07', NULL, NULL, 0, 0, 8.13, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('aeaecd3e-5952-4d93-9354-183d5e1b67bc', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-22 02:32:42', '2025-11-22 10:32:42', NULL, NULL, 1, 0, 8.19, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('af661fee-fd88-40db-9424-a70b45656db0', '57b017b3-7414-4014-b107-3a588834d289', NULL, '2025-11-15 20:20:19', '2025-11-16 04:20:19', NULL, NULL, 0, 0, 7.84, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('afb93889-00ab-4836-a572-a549503f2701', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-04 11:47:28', '2025-11-04 19:47:28', NULL, NULL, 0, 0, 7.78, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('b9feec82-305f-43a2-95e6-e064f6a31054', '8abcab26-c588-4ca3-be20-a68ea71759e9', NULL, '2025-11-23 04:51:50', '2025-11-23 12:51:50', NULL, NULL, 0, 0, 8.20, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('c2333f52-b6eb-4e67-bd2d-7d86c6d2a2fa', '0788868b-90aa-43db-aa00-7b080c3fc3bc', NULL, '2025-11-20 21:00:39', '2025-11-21 06:00:39', NULL, NULL, 0, 0, 7.78, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('c2ae0dc7-9994-49af-b183-d4cb1b50f781', '0788868b-90aa-43db-aa00-7b080c3fc3bc', NULL, '2025-11-01 11:21:28', '2025-11-01 19:21:28', NULL, NULL, 0, 0, 7.93, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('d1760805-04b9-4933-8a71-400f42e6e1ad', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-10 17:37:40', '2025-11-11 02:37:40', NULL, NULL, 1, 0, 7.78, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('d177cef0-1f03-4a5a-b7e5-97bab5b4470d', '57b017b3-7414-4014-b107-3a588834d289', NULL, '2025-11-13 20:46:19', '2025-11-14 05:46:19', NULL, NULL, 1, 0, 8.03, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('d3917211-ad81-4d0d-b289-6a069e854073', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-11-05 10:00:28', '2025-11-05 18:00:28', NULL, NULL, 0, 0, 8.15, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('db9a93f9-cc7d-478d-9397-be4fecfbb433', '57b017b3-7414-4014-b107-3a588834d289', NULL, '2025-11-26 18:55:30', '2025-11-27 03:55:30', NULL, NULL, 0, 0, 7.93, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('ddb3f93e-8216-4643-801f-d0b9f6af6413', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-11-24 10:20:11', '2025-11-24 18:20:11', NULL, NULL, 1, 0, 8.21, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('deb322ff-e115-4fd4-aadb-d956d00c1429', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-11-16 04:57:13', '2025-11-16 13:57:13', NULL, NULL, 0, 0, 7.98, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('e230e254-07bb-4a1b-b199-21279e0f036f', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-11-27 04:32:21', '2025-11-27 12:32:21', NULL, NULL, 0, 0, 8.16, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('e9b6d886-2450-4f30-9b70-989988ee391b', '8abcab26-c588-4ca3-be20-a68ea71759e9', NULL, '2025-11-23 02:42:05', '2025-11-23 10:42:05', NULL, NULL, 0, 0, 7.95, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('eb313869-e7c0-459b-bcb6-21b57a5cd80f', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-25 02:09:38', '2025-11-25 11:09:38', NULL, NULL, 0, 0, 8.04, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('ebe535a7-08c3-4b7f-ab1f-39c4191182f7', '8abcab26-c588-4ca3-be20-a68ea71759e9', NULL, '2025-11-24 15:11:13', '2025-11-24 23:11:13', NULL, NULL, 0, 0, 7.85, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('ec80fb89-af0d-48f8-ba07-15e999d90b1b', '472950a5-9704-4530-a328-094f8a33ca4c', NULL, '2025-11-25 08:04:32', '2025-11-25 16:04:32', NULL, NULL, 0, 0, 8.15, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('ed1ac7f5-700b-4a2d-b6ed-4b4ef3c08ab4', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-11-06 00:51:07', '2025-11-06 08:51:07', NULL, NULL, 0, 0, 7.86, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('f8e882d7-9235-4472-b8d5-cd5316defe7b', '0788868b-90aa-43db-aa00-7b080c3fc3bc', NULL, '2025-11-02 22:59:56', '2025-11-03 06:59:56', NULL, NULL, 0, 0, 7.88, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('fb4e3fdf-4db2-4f50-9800-db3638f7884b', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', NULL, '2025-11-09 07:51:35', '2025-11-09 15:51:35', NULL, NULL, 0, 0, 7.95, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('fbc4f508-faf4-49c0-b892-b46c41f939ad', '0788868b-90aa-43db-aa00-7b080c3fc3bc', NULL, '2025-10-30 17:40:14', '2025-10-31 02:40:14', NULL, NULL, 1, 0, 7.96, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('fd0d24be-76a9-4876-bb55-6663a7ae56a1', '57b017b3-7414-4014-b107-3a588834d289', NULL, '2025-11-14 22:13:38', '2025-11-15 07:13:38', NULL, NULL, 0, 0, 8.08, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39');

-- --------------------------------------------------------

--
-- Table structure for table `clock_in_devices`
--

CREATE TABLE `clock_in_devices` (
  `id` varchar(36) NOT NULL,
  `deviceName` varchar(255) NOT NULL,
  `ipAddress` varchar(50) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `corrective_actions`
--

CREATE TABLE `corrective_actions` (
  `id` varchar(36) NOT NULL,
  `incidentId` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `dueDate` datetime NOT NULL,
  `completedAt` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
('0d981c8f-ca44-11f0-8943-3448ed0ea1e2', 'Compounding', 'Compounding department', '2025-11-26 02:16:37', '2025-11-26 02:16:37'),
('0d987e62-ca44-11f0-8943-3448ed0ea1e2', 'Fulfillment', 'Fulfillment department', '2025-11-26 02:16:37', '2025-11-26 02:16:37'),
('217552b1-00f0-4a91-8f12-4e6329915199', 'Pharmacy', 'Pharmacy operations and compounding', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a1363655-8191-4aac-83d7-4afa3f033529', 'Administration', 'Administrative functions', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', 'HR', 'Human Resources', '2025-11-19 01:05:32', '2025-11-19 01:05:32');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `fileUrl` text NOT NULL,
  `fileSize` int(11) NOT NULL,
  `mimeType` varchar(100) DEFAULT NULL,
  `uploadedBy` varchar(36) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `employeeId`, `name`, `type`, `fileUrl`, `fileSize`, `mimeType`, `uploadedBy`, `createdAt`, `updatedAt`) VALUES
('07bb69dc-5595-47d1-b516-ebf53f682ac3', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'Background Check - 2025', 'Background Check', 'https://example.com/documents/98a45fb3-4fe9-4776-aa92-5f42996abfcd.pdf', 687802, 'application/pdf', '472950a5-9704-4530-a328-094f8a33ca4c', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('55551c02-43d9-44ac-89b5-3d37f5f19a59', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'Certificate - 2025', 'Certificate', 'https://example.com/documents/d8eba0c7-afc7-4684-a3fb-69fb36fcbf0c.pdf', 1292666, 'application/pdf', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('79e08e75-dda4-47d4-a766-3533bb77139b', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'ID - 2025', 'ID', 'https://example.com/documents/b2b3ca2b-fb81-4e1e-9f1a-cfac0a6c9586.pdf', 1207809, 'application/pdf', '472950a5-9704-4530-a328-094f8a33ca4c', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('7a6244d7-aaa4-48a9-b476-bd972cdced16', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'Background Check - 2025', 'Background Check', 'https://example.com/documents/c14fb9e0-ceb4-402a-b97f-223b5c78606e.pdf', 483031, 'application/pdf', '8abcab26-c588-4ca3-be20-a68ea71759e9', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('81cf9533-25d1-4096-903a-c20669f10613', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'Certificate - 2025', 'Certificate', 'https://example.com/documents/b89ca11b-aab0-4f1f-8b45-334e5f36adec.pdf', 1207814, 'application/pdf', '8abcab26-c588-4ca3-be20-a68ea71759e9', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('a88f67db-7edd-4ea3-a5d1-aff00e816914', '57b017b3-7414-4014-b107-3a588834d289', 'Resume - 2025', 'Resume', 'https://example.com/documents/8a437de7-a9da-4f45-b86f-65257d0324a6.pdf', 1898301, 'application/pdf', '6c449300-9476-4916-9550-b3760ab9ab1b', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('adabf9d1-4dd8-4561-aca1-94f0e20d4d5d', '472950a5-9704-4530-a328-094f8a33ca4c', 'Resume - 2025', 'Resume', 'https://example.com/documents/0a596e1a-d257-4f3b-80e7-6acd4fb5c241.pdf', 1113879, 'application/pdf', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('c1acc936-c668-4261-8a2a-9396210147ab', '6c449300-9476-4916-9550-b3760ab9ab1b', 'Resume - 2025', 'Resume', 'https://example.com/documents/340ef859-a57f-4299-8a28-dba95aabb813.pdf', 689286, 'application/pdf', '8abcab26-c588-4ca3-be20-a68ea71759e9', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('c78464a3-cff4-44f4-8ccb-989959cdaa76', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'License Copy - 2025', 'License Copy', 'https://example.com/documents/eb17e9a3-9ca4-4a93-83af-7c42c6ec0962.pdf', 1598615, 'application/pdf', '472950a5-9704-4530-a328-094f8a33ca4c', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('d5bb1559-6672-4c36-958b-19deced6bd74', '472950a5-9704-4530-a328-094f8a33ca4c', 'Background Check - 2025', 'Background Check', 'https://example.com/documents/496951c4-81fd-4db9-a1bc-2d2e54660d1a.pdf', 2005520, 'application/pdf', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('f54b1f78-69d6-4eea-94ce-06fceeaab7be', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'License Copy - 2025', 'License Copy', 'https://example.com/documents/4e5c24a6-e6ec-4411-96d4-fce438f7e529.pdf', 237339, 'application/pdf', '6c449300-9476-4916-9550-b3760ab9ab1b', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('fb61a9d4-dfe0-4c5f-ab75-a0ca162b65e2', '57b017b3-7414-4014-b107-3a588834d289', 'Certificate - 2025', 'Certificate', 'https://example.com/documents/3f4d3bdb-88e7-470c-a656-a94fac8a6501.pdf', 187820, 'application/pdf', '6c449300-9476-4916-9550-b3760ab9ab1b', '2025-11-28 00:09:40', '2025-11-28 00:09:40');

-- --------------------------------------------------------

--
-- Table structure for table `emergency_contacts`
--

CREATE TABLE `emergency_contacts` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `relationship` varchar(100) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `isPrimary` tinyint(1) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `emergency_contacts`
--

INSERT INTO `emergency_contacts` (`id`, `employeeId`, `name`, `relationship`, `phone`, `email`, `isPrimary`, `createdAt`, `updatedAt`) VALUES
('1c9974de-fbb6-4106-9e97-29dfdfd06532', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'Et eiusmod laudantiu', 'Sibling', '+1 (319) 393-3504', 'sixybakyvi@mailinator.com', 0, '2025-11-27 22:41:26', '2025-11-27 22:41:26'),
('4e2adb9d-71bc-4703-9459-d27178d93f20', '6c449300-9476-4916-9550-b3760ab9ab1b', 'Contact 2 for Employee', 'Parent', '555-2894', 'contact2@example.com', 0, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('7c93d143-b1c2-47fe-b3d1-0c312860a288', '6c449300-9476-4916-9550-b3760ab9ab1b', 'Contact 1 for Employee', 'Spouse', '555-4853', 'contact1@example.com', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('7e360868-6b2c-4f21-8d65-be5f38839f2e', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'Contact 2 for Employee', 'Friend', '555-2478', 'contact2@example.com', 0, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('882edbfe-dea0-48f2-9f48-7f469afc01da', '6c449300-9476-4916-9550-b3760ab9ab1b', 'John Doe', 'Friend', '123123123', 'email@exampl.com', 1, '2025-11-26 06:02:15', '2025-11-26 06:02:15'),
('95fbbc68-a775-4281-8335-66f37943e87a', '472950a5-9704-4530-a328-094f8a33ca4c', 'Contact 1 for Employee', 'Sibling', '555-4804', 'contact1@example.com', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('988752e0-8d18-4424-8633-4fde1b86e216', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'Contact 2 for Employee', 'Spouse', '555-3660', 'contact2@example.com', 0, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('9c132d63-62ee-4ab9-8079-b845ffcac689', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'Contact 1 for Employee', 'Spouse', '555-1770', 'contact1@example.com', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('c4c03118-d896-41a6-b962-763f89b790e2', '57b017b3-7414-4014-b107-3a588834d289', 'Contact 1 for Employee', 'Sibling', '555-6073', 'contact1@example.com', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('ddbc901b-4cda-47d4-99fb-cb74dd5d50ef', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'Contact 2 for Employee', 'Sibling', '555-3995', 'contact2@example.com', 0, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('eef50fab-5ee2-4fb5-9ff1-86fb1ecd6272', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'Contact 1 for Employee', 'Sibling', '555-9336', 'contact1@example.com', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('f3ff4174-296b-4f09-a544-803a416c3a98', '57b017b3-7414-4014-b107-3a588834d289', 'Contact 2 for Employee', 'Spouse', '555-9661', 'contact2@example.com', 0, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('f842a606-29f0-46dc-854f-f941cc087b49', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'Contact 1 for Employee', 'Sibling', '555-8926', 'contact1@example.com', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zipCode` varchar(20) DEFAULT NULL,
  `hireDate` date NOT NULL,
  `terminationDate` date DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `departmentId` varchar(36) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employeeId`, `firstName`, `lastName`, `email`, `phone`, `dateOfBirth`, `address`, `city`, `state`, `zipCode`, `hireDate`, `terminationDate`, `isActive`, `departmentId`, `designation`, `password`, `createdAt`, `updatedAt`) VALUES
('0788868b-90aa-43db-aa00-7b080c3fc3bc', 'EMP001', 'Chiquita', 'Daugherty', 'vano@mailinator.com', '+1 (641) 338-9957', '1977-11-11', 'Repudiandae nostrud ', 'Culpa ut quis et es', 'NV', '22714', '2015-11-10', NULL, 1, '0d981c8f-ca44-11f0-8943-3448ed0ea1e2', NULL, '$2a$10$AYrGV7FKFd9TMOWp54.AAekBH2nU8A3zEuX8/Yr40UQv84pF1OTeq', '2025-11-27 22:41:26', '2025-11-27 22:41:26'),
('38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'FULF001', 'Fulfillment', 'Tech', 'fulfillment.tech@emeraldsrx.com', '555-0006', NULL, NULL, NULL, NULL, NULL, '2021-02-01', NULL, 1, '0d987e62-ca44-11f0-8943-3448ed0ea1e2', NULL, '$2a$10$9/i6lC8YU18HQlHgWnqwreqIy6IgqTWkkim.UIwNqUeJwEOLCuzAO', '2025-11-26 02:20:52', '2025-11-26 02:20:52'),
('472950a5-9704-4530-a328-094f8a33ca4c', 'LEAD001', 'Lead', 'Compounding', 'lead.compounding@emeraldsrx.com', '555-0003', NULL, NULL, NULL, NULL, NULL, '2018-06-01', NULL, 1, '0d981c8f-ca44-11f0-8943-3448ed0ea1e2', NULL, '$2a$10$9/i6lC8YU18HQlHgWnqwreqIy6IgqTWkkim.UIwNqUeJwEOLCuzAO', '2025-11-26 02:20:52', '2025-11-26 02:20:52'),
('57b017b3-7414-4014-b107-3a588834d289', 'HRM001', 'HR', 'Manager', 'hrmanager@emeraldsrx.com', '555-0002', NULL, NULL, NULL, NULL, NULL, '2019-03-01', NULL, 1, 'ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', NULL, '$2a$10$qHFKzUm/IOAIz9kBYITU5.E1NmDd4cu3/I8A3I298VRv/68DdLDI.', '2025-11-26 02:20:52', '2025-11-28 03:25:03'),
('6c449300-9476-4916-9550-b3760ab9ab1b', 'COMP001', 'John', 'Doe', 'compounding.technician@emeraldrxhr.com', '+1234567890', '2000-02-25', NULL, NULL, NULL, NULL, '2025-11-26', NULL, 1, '0d981c8f-ca44-11f0-8943-3448ed0ea1e2', NULL, '$2a$10$o.NGjgeHRtQ5f.mblM/oZu.pcZVyKOC0TS6wVGVv/QSuCseL6GU/i', '2025-11-26 06:02:15', '2025-11-28 03:25:34'),
('8abcab26-c588-4ca3-be20-a68ea71759e9', 'ADMIN001', 'Admin', 'User', 'admin@emeraldsrx.com', '555-0001', NULL, NULL, NULL, NULL, NULL, '2020-01-01', NULL, 1, 'ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', NULL, '$2a$10$Gcz5xlHzTXARuIsErmiuuext3Hb3bIIubGEL3HIvTx265uG2sUfju', '2025-11-26 02:20:52', '2025-11-28 03:25:15');

-- --------------------------------------------------------

--
-- Table structure for table `employee_document_uploads`
--

CREATE TABLE `employee_document_uploads` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `hrDocumentId` varchar(36) DEFAULT NULL,
  `documentName` varchar(255) NOT NULL,
  `documentType` varchar(100) NOT NULL,
  `fileUrl` text NOT NULL,
  `fileSize` int(11) NOT NULL,
  `mimeType` varchar(100) DEFAULT NULL,
  `approvalStatus` varchar(50) DEFAULT 'pending',
  `approvedBy` varchar(36) DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  `uploadedByEmployee` tinyint(1) DEFAULT 1,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_onboarding_tasks`
--

CREATE TABLE `employee_onboarding_tasks` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `taskId` varchar(36) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `completedAt` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_onboarding_tasks`
--

INSERT INTO `employee_onboarding_tasks` (`id`, `employeeId`, `taskId`, `status`, `completedAt`, `notes`, `createdAt`, `updatedAt`) VALUES
('9301fb24-ca63-11f0-8943-3448ed0ea1e2', '6c449300-9476-4916-9550-b3760ab9ab1b', '3676d95a-76ae-4ef7-bcf6-e1c2bfcef81a', 'pending', NULL, NULL, '2025-11-26 06:02:15', '2025-11-26 06:02:15'),
('93023a9f-ca63-11f0-8943-3448ed0ea1e2', '6c449300-9476-4916-9550-b3760ab9ab1b', 'd30e4517-e69d-4e22-9a8b-76212279e959', 'pending', NULL, NULL, '2025-11-26 06:02:15', '2025-11-26 06:02:15'),
('93024638-ca63-11f0-8943-3448ed0ea1e2', '6c449300-9476-4916-9550-b3760ab9ab1b', '97a0e67a-8585-403b-9a03-75f4f9692bd4', 'pending', NULL, NULL, '2025-11-26 06:02:15', '2025-11-26 06:02:15'),
('93029731-ca63-11f0-8943-3448ed0ea1e2', '6c449300-9476-4916-9550-b3760ab9ab1b', '1bffc4e7-0f92-4a98-9a6b-3fb7c304c456', 'pending', NULL, NULL, '2025-11-26 06:02:15', '2025-11-26 06:02:15');

-- --------------------------------------------------------

--
-- Table structure for table `employee_permissions`
--

CREATE TABLE `employee_permissions` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT json_object() CHECK (json_valid(`permissions`)),
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_policy_acks`
--

CREATE TABLE `employee_policy_acks` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `policyId` varchar(36) NOT NULL,
  `acknowledgedAt` datetime DEFAULT current_timestamp(),
  `ipAddress` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_policy_acks`
--

INSERT INTO `employee_policy_acks` (`id`, `employeeId`, `policyId`, `acknowledgedAt`, `ipAddress`, `createdAt`) VALUES
('0da9b047-88f3-421f-9b45-74f06476576b', '57b017b3-7414-4014-b107-3a588834d289', '92d89746-9460-4021-a6e2-c7460a7f5f7c', '2025-11-28 00:09:40', '192.168.1.187', '2025-11-28 00:09:40'),
('14cd9d6a-8143-4513-9d2f-eca0eff6bac0', '57b017b3-7414-4014-b107-3a588834d289', '6cf9b09b-96be-4cca-902b-8cd07782121a', '2025-11-28 00:09:40', '192.168.1.243', '2025-11-28 00:09:40'),
('181fc11f-3fd1-4367-99f9-89f665aefe24', '472950a5-9704-4530-a328-094f8a33ca4c', '6acbe686-02a5-45e6-ac39-f473a7dde1c0', '2025-11-28 00:09:40', '192.168.1.151', '2025-11-28 00:09:40'),
('218ef429-be58-4156-999a-e2ef9d452cc4', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', '8046bab9-4bd2-4775-b87d-092d7f6e1e83', '2025-11-28 00:09:40', '192.168.1.199', '2025-11-28 00:09:40'),
('303cb86f-4ea6-49fd-aaba-4f896374315c', '57b017b3-7414-4014-b107-3a588834d289', 'd8c1190c-f84e-4cf1-8829-25ebae11099e', '2025-11-28 00:09:40', '192.168.1.168', '2025-11-28 00:09:40'),
('58a8b669-5cb9-4fb5-80f7-e5de5b2d7d2e', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', '9cd9ef92-c135-4cfb-8f2e-8a85ce2724e3', '2025-11-28 00:09:40', '192.168.1.158', '2025-11-28 00:09:40'),
('67c8a55a-149e-4b0b-b959-5eda0b1e5ddd', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'cfad7f6e-14c3-497e-aced-8b3825ca52da', '2025-11-28 00:09:40', '192.168.1.40', '2025-11-28 00:09:40'),
('6e84607d-54b5-41d9-8b90-cd9083af9624', '6c449300-9476-4916-9550-b3760ab9ab1b', 'ff8bfd03-5305-4b2f-80e2-1ddffa2832c9', '2025-11-28 00:09:40', '192.168.1.52', '2025-11-28 00:09:40'),
('90043247-848c-4bf7-b573-8426f11b781a', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', '92d89746-9460-4021-a6e2-c7460a7f5f7c', '2025-11-28 00:09:40', '192.168.1.45', '2025-11-28 00:09:40'),
('94d41c5d-0657-4ad0-834d-442c4402dc8c', '0788868b-90aa-43db-aa00-7b080c3fc3bc', '8046bab9-4bd2-4775-b87d-092d7f6e1e83', '2025-11-28 00:09:40', '192.168.1.99', '2025-11-28 00:09:40'),
('994a4cce-7be5-4c4c-b547-297c718c8b3f', '57b017b3-7414-4014-b107-3a588834d289', 'ff8bfd03-5305-4b2f-80e2-1ddffa2832c9', '2025-11-28 00:09:40', '192.168.1.30', '2025-11-28 00:09:40'),
('99ab3764-87ce-4c07-a2cb-c9ebf3adf91a', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'ff8bfd03-5305-4b2f-80e2-1ddffa2832c9', '2025-11-28 00:09:40', '192.168.1.110', '2025-11-28 00:09:40'),
('aaecba93-3db8-444d-844b-0e3ad7f65035', '6c449300-9476-4916-9550-b3760ab9ab1b', '8046bab9-4bd2-4775-b87d-092d7f6e1e83', '2025-11-28 00:09:40', '192.168.1.0', '2025-11-28 00:09:40'),
('bec22001-ac3e-4f66-b6a5-c5fcd9be78eb', '6c449300-9476-4916-9550-b3760ab9ab1b', '9cd9ef92-c135-4cfb-8f2e-8a85ce2724e3', '2025-11-28 00:09:40', '192.168.1.93', '2025-11-28 00:09:40'),
('c42445af-d800-409f-9344-c6eed159cd3e', '472950a5-9704-4530-a328-094f8a33ca4c', '9cd9ef92-c135-4cfb-8f2e-8a85ce2724e3', '2025-11-28 00:09:40', '192.168.1.136', '2025-11-28 00:09:40'),
('d5b37c09-9514-4334-95b9-e0f931e207a8', '6c449300-9476-4916-9550-b3760ab9ab1b', '6acbe686-02a5-45e6-ac39-f473a7dde1c0', '2025-11-28 00:09:40', '192.168.1.29', '2025-11-28 00:09:40'),
('d5fb1642-c9f0-406c-bb8a-6114cdacad75', '472950a5-9704-4530-a328-094f8a33ca4c', 'd8c1190c-f84e-4cf1-8829-25ebae11099e', '2025-11-28 00:09:40', '192.168.1.72', '2025-11-28 00:09:40'),
('e521ffe7-2423-49f0-98f4-1538deadc252', '472950a5-9704-4530-a328-094f8a33ca4c', '8046bab9-4bd2-4775-b87d-092d7f6e1e83', '2025-11-28 00:09:40', '192.168.1.116', '2025-11-28 00:09:40'),
('f76b2e53-25fc-4492-8657-0e3643988a93', '0788868b-90aa-43db-aa00-7b080c3fc3bc', '9cd9ef92-c135-4cfb-8f2e-8a85ce2724e3', '2025-11-28 00:09:40', '192.168.1.174', '2025-11-28 00:09:40');

-- --------------------------------------------------------

--
-- Table structure for table `employee_roles`
--

CREATE TABLE `employee_roles` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `roleId` varchar(36) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_roles`
--

INSERT INTO `employee_roles` (`id`, `employeeId`, `roleId`, `createdAt`) VALUES
('3a8c0241-790d-44ae-868b-a9249ab30674', '57b017b3-7414-4014-b107-3a588834d289', 'e69990bf-4026-45cc-8b0a-5211e571de10', '2025-11-28 00:11:08'),
('b4153903-ca7a-479c-b336-1543ed783f9f', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'cca61a07-12eb-4d64-93a8-dbdf69c1eaaa', '2025-11-28 00:09:28'),
('b7184e6a-203a-4774-9350-bbd77fb50e1a', '472950a5-9704-4530-a328-094f8a33ca4c', 'cca61a07-12eb-4d64-93a8-dbdf69c1eaaa', '2025-11-28 00:09:28'),
('c6d8265e-9d29-4c0d-8b5d-996fe5e905b9', '6c449300-9476-4916-9550-b3760ab9ab1b', 'cca61a07-12eb-4d64-93a8-dbdf69c1eaaa', '2025-11-28 00:09:28'),
('ea43e1be-5ebd-432b-96c9-3fe3e67d4490', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'cca61a07-12eb-4d64-93a8-dbdf69c1eaaa', '2025-11-28 00:09:28'),
('fa8a393c-b6d3-45c5-90bf-4b60e77dc887', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'e206a38b-a514-4c21-8ccd-cc6c70daa891', '2025-11-28 00:10:41');

-- --------------------------------------------------------

--
-- Table structure for table `employee_training_records`
--

CREATE TABLE `employee_training_records` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `trainingId` varchar(36) NOT NULL,
  `assignedDate` datetime DEFAULT current_timestamp(),
  `completedDate` datetime DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `score` int(11) DEFAULT NULL,
  `certificateUrl` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_training_records`
--

INSERT INTO `employee_training_records` (`id`, `employeeId`, `trainingId`, `assignedDate`, `completedDate`, `dueDate`, `status`, `score`, `certificateUrl`, `notes`, `createdAt`, `updatedAt`) VALUES
('0f6af773-7ae0-4a8b-9ce9-3179c8e480b2', '472950a5-9704-4530-a328-094f8a33ca4c', '77114c70-7bfb-47f9-a487-36b58641228d', '2025-10-22 18:38:56', '2025-11-04 14:17:11', '2025-11-21 18:38:56', 'completed', 78, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('1b9814bd-b9f6-41a1-94ef-45a99d223654', '472950a5-9704-4530-a328-094f8a33ca4c', '77114c70-7bfb-47f9-a487-36b58641228d', '2025-02-23 03:42:47', NULL, '2025-12-25 00:00:00', 'overdue', NULL, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 04:11:37'),
('2792b0be-4fc6-4b0e-b8e9-bad1f04e4d28', '6c449300-9476-4916-9550-b3760ab9ab1b', '30cda8d6-730f-448b-bba6-5090317f7be3', '2024-12-13 23:32:12', NULL, '2025-12-12 00:00:00', 'in_progress', NULL, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 04:14:19'),
('2bcbabe0-7d57-44df-a5c3-8802dfc4c18c', '6c449300-9476-4916-9550-b3760ab9ab1b', '0a05264a-3207-40db-a69a-1451e78c4455', '2025-03-14 13:30:09', NULL, '2025-04-13 13:30:09', 'pending', NULL, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('4fb08bd3-0c07-4113-805d-3ed78561a5bc', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', '570dc884-9f3e-4594-a4fb-4a55f8fef134', '2025-11-27 01:54:23', '2025-11-27 01:54:54', '2026-02-27 00:00:00', 'completed', 90, '/uploads/file-1764190486373-698874030.jpg', 'Testing', '2025-11-27 01:54:23', '2025-11-27 01:54:54'),
('53e7d02e-d00a-4f90-9f3a-02ddf110d22a', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'c401d8f6-2327-46be-80e4-3241c7082e20', '2025-07-10 06:03:08', '2025-11-04 07:08:00', '2025-08-09 06:03:08', 'completed', 94, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('71dfacab-eec4-4141-91ef-96e18490ef4b', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'c01cf454-0673-46ca-8906-98d466e98dba', '2025-06-06 20:01:18', '2025-07-06 15:11:00', '2025-07-06 20:01:18', 'completed', 75, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('7c087875-694a-4cb7-a52d-beffb87752e2', '472950a5-9704-4530-a328-094f8a33ca4c', 'e1afe686-1867-4f54-a346-803bc2466351', '2023-02-09 20:27:14', NULL, '2025-11-27 00:00:00', 'overdue', NULL, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 04:11:51'),
('ada01d0d-f6d6-4228-81fe-6c30296fcca5', '6c449300-9476-4916-9550-b3760ab9ab1b', 'c01cf454-0673-46ca-8906-98d466e98dba', '2024-04-08 19:05:21', NULL, '2025-12-08 00:00:00', 'pending', NULL, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 04:14:06'),
('b6817f10-2a35-4e7a-bb19-6e84b765b12b', '472950a5-9704-4530-a328-094f8a33ca4c', 'b1d42333-bb0f-4ccc-b646-2105d2b50510', '2023-10-17 10:34:30', NULL, '2025-10-16 00:00:00', 'overdue', NULL, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 04:12:30'),
('eab00d20-62ec-4273-b61f-8810f3854426', '57b017b3-7414-4014-b107-3a588834d289', 'b1d42333-bb0f-4ccc-b646-2105d2b50510', '2023-09-26 16:49:39', NULL, '2025-12-26 00:00:00', 'in_progress', NULL, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 04:11:19');

-- --------------------------------------------------------

--
-- Table structure for table `hr_documents`
--

CREATE TABLE `hr_documents` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `documentType` varchar(100) NOT NULL,
  `documentUrl` text NOT NULL,
  `isRequired` tinyint(1) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `category` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hr_documents`
--

INSERT INTO `hr_documents` (`id`, `title`, `description`, `documentType`, `documentUrl`, `isRequired`, `isActive`, `category`, `createdAt`, `updatedAt`) VALUES
('3541c35b-3451-45bf-b69c-528858a69c1a', 'W4 Form', 'Official W4 Form template for new employees', 'W4 Form', 'https://example.com/hr-docs/w4-form.pdf', 1, 1, 'Onboarding', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('50c0c556-98d1-4a5c-90d9-604a020f72b0', 'I9 Form', 'Official I9 Form template for new employees', 'I9 Form', 'https://example.com/hr-docs/i9-form.pdf', 1, 1, 'Onboarding', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('7831ad15-0740-4c0a-b659-edaf95f4b259', 'Direct Deposit Form', 'Official Direct Deposit Form template for new employees', 'Direct Deposit Form', 'https://example.com/hr-docs/direct-deposit-form.pdf', 1, 1, 'Onboarding', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('9e12c42c-a50b-4429-828b-217b02762170', 'Employee Handbook', 'Official Employee Handbook template for new employees', 'Employee Handbook', 'https://example.com/hr-docs/employee-handbook.pdf', 0, 1, 'Onboarding', '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('ea5393bc-e798-4864-8265-1996f2ce4ed2', 'Emergency Contact Form', 'Official Emergency Contact Form template for new employees', 'Emergency Contact Form', 'https://example.com/hr-docs/emergency-contact-form.pdf', 1, 1, 'Onboarding', '2025-11-28 00:09:40', '2025-11-28 00:09:40');

-- --------------------------------------------------------

--
-- Table structure for table `incidents`
--

CREATE TABLE `incidents` (
  `id` varchar(36) NOT NULL,
  `type` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `employeeId` varchar(36) DEFAULT NULL,
  `reportedBy` varchar(36) NOT NULL,
  `severity` varchar(50) DEFAULT 'low',
  `status` varchar(50) DEFAULT 'open',
  `occurredAt` datetime NOT NULL,
  `reportedAt` datetime DEFAULT current_timestamp(),
  `resolvedAt` datetime DEFAULT NULL,
  `resolutionNotes` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `incidents`
--

INSERT INTO `incidents` (`id`, `type`, `title`, `description`, `employeeId`, `reportedBy`, `severity`, `status`, `occurredAt`, `reportedAt`, `resolvedAt`, `resolutionNotes`, `createdAt`, `updatedAt`) VALUES
('176776ac-bb02-4403-a08e-16213908e85c', 'HIPAA', 'Incident 1: HIPAA Issue', 'Description of hipaa incident that occurred.', NULL, 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'low', 'open', '2025-11-14 00:00:00', '2025-11-15 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('4c8debf2-f432-46a1-91ab-7d68d224d458', 'Safety', 'Incident 8: Safety Issue', 'Description of safety incident that occurred.', NULL, '14da6ba5-e41c-4825-a468-e55144d233f6', 'medium', 'in_progress', '2025-10-21 00:00:00', '2025-10-22 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('62d8bc25-bdf4-4c96-8c80-e7cd2b27e213', 'Medication Error', 'Incident 6: Medication Error Issue', 'Description of medication error incident that occurred.', NULL, '5f94109d-7d2c-461a-991d-c233313ce128', 'high', 'closed', '2025-09-19 00:00:00', '2025-09-20 00:00:00', '2025-09-25 00:00:00', 'Issue resolved with corrective action implemented.', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('b4b76805-b6f3-4a75-952c-63980e2fb797', 'Safety', 'Incident 2: Safety Issue', 'Description of safety incident that occurred.', NULL, '87efcad0-6e83-4541-bff2-4c54cda978e3', 'medium', 'in_progress', '2025-10-15 00:00:00', '2025-10-16 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('c727bf0d-29e7-43a4-8c7b-6be032573a45', 'Medication Error', 'Incident 3: Medication Error Issue', 'Description of medication error incident that occurred.', NULL, 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'high', 'closed', '2025-09-16 00:00:00', '2025-09-17 00:00:00', '2025-09-22 00:00:00', 'Issue resolved with corrective action implemented.', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d8da03ec-88dd-48e9-9a37-593bd86172c1', 'HIPAA', 'Incident 7: HIPAA Issue', 'Description of hipaa incident that occurred.', NULL, '71c6818d-8c95-468a-979c-62ff555ad2c7', 'low', 'open', '2025-11-20 00:00:00', '2025-11-21 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f18aae78-d060-46ab-b788-54c991b47b6d', 'Safety', 'Incident 5: Safety Issue', 'Description of safety incident that occurred.', NULL, 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'medium', 'in_progress', '2025-10-18 00:00:00', '2025-10-19 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('fce17e0e-05eb-46d2-98b7-16303f1acd51', 'HIPAA', 'Incident 4: HIPAA Issue', 'Description of hipaa incident that occurred.', NULL, '3f808a8a-d28b-4170-b749-1c3e5538e952', 'low', 'open', '2025-11-17 00:00:00', '2025-11-18 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `type` varchar(50) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `daysRequested` decimal(5,2) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `approvedBy` varchar(36) DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  `managerComments` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_requests`
--

INSERT INTO `leave_requests` (`id`, `employeeId`, `type`, `startDate`, `endDate`, `daysRequested`, `reason`, `status`, `approvedBy`, `approvedAt`, `rejectionReason`, `managerComments`, `createdAt`, `updatedAt`) VALUES
('21c34fec-5951-411a-8c16-5d007330bab3', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'Personal', '2026-02-08', '2026-02-12', 5.00, 'Request for personal', 'approved', NULL, NULL, NULL, NULL, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('429e1bdd-4f28-4a64-b3e1-a8002aa2fa32', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'Vacation', '2026-01-29', '2026-02-03', 6.00, 'Request for vacation', 'approved', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '2025-11-28 03:17:15', NULL, NULL, '2025-11-28 00:09:40', '2025-11-28 03:17:15'),
('454ab130-39ca-489b-a807-149623bdf0dc', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'Family Emergency', '2025-12-02', '2025-12-04', 3.00, 'Request for family emergency', 'approved', NULL, NULL, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('60b84df3-0717-46f8-95d9-0c7bf099b864', '472950a5-9704-4530-a328-094f8a33ca4c', 'Sick Leave', '2025-12-06', '2025-12-08', 3.00, 'Request for sick leave', 'pending', NULL, NULL, NULL, NULL, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('6779e400-242c-4c70-a87c-b340010c4482', '57b017b3-7414-4014-b107-3a588834d289', 'Bereavement', '2025-12-28', '2025-12-31', 4.00, 'Request for bereavement', 'pending', NULL, NULL, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('6b1452b8-4f8e-40f2-b9d6-4aaf46656af5', '6c449300-9476-4916-9550-b3760ab9ab1b', 'Bereavement', '2025-12-01', '2025-12-03', 3.00, 'Request for bereavement', 'rejected', NULL, NULL, NULL, NULL, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('7d0e07ee-a690-4e5b-bf18-ccff82c8d44c', '6c449300-9476-4916-9550-b3760ab9ab1b', 'Vacation', '2026-01-24', '2026-01-25', 2.00, 'Request for vacation', 'pending', NULL, NULL, NULL, NULL, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('bb4d4e68-ee90-42f7-b508-24055c4c1ac5', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'Sick Leave', '2026-01-18', '2026-01-23', 6.00, 'Request for sick leave', 'rejected', NULL, NULL, NULL, NULL, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('ca86628b-cc76-4f7d-9eb7-3c2b0575d4ce', '6c449300-9476-4916-9550-b3760ab9ab1b', 'Sick Leave', '2025-12-06', '2025-12-08', 3.00, 'Request for sick leave', 'rejected', NULL, NULL, NULL, NULL, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('e568a0ec-1fc4-421d-9e25-6c3e44fd3595', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'Vacation', '2026-01-22', '2026-01-23', 2.00, 'Request for vacation', 'pending', NULL, NULL, NULL, NULL, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('e711d539-7183-42b2-80d1-45716ae779c1', '472950a5-9704-4530-a328-094f8a33ca4c', 'Personal', '2026-02-19', '2026-02-23', 5.00, 'Request for personal', 'rejected', NULL, NULL, NULL, NULL, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('e9e02060-2e40-495f-a9df-ee7aa3aeee5d', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'Vacation', '2026-02-16', '2026-02-19', 4.00, 'Request for vacation', 'rejected', NULL, NULL, NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39');

-- --------------------------------------------------------

--
-- Table structure for table `licenses`
--

CREATE TABLE `licenses` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `licenseNumber` varchar(255) NOT NULL,
  `state` varchar(100) NOT NULL,
  `issueDate` date NOT NULL,
  `expiryDate` date NOT NULL,
  `documentUrl` text DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `licenses`
--

INSERT INTO `licenses` (`id`, `employeeId`, `type`, `licenseNumber`, `state`, `issueDate`, `expiryDate`, `documentUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES
('03b29b45-84e5-4ad9-9a22-8eb05dbe3781', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'State License', 'CA-65123', 'CA', '2020-06-22', '2022-06-22', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('0c420668-94a1-4c74-864c-e7a80cc0004c', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'Pharmacy Technician', 'TX-3440', 'TX', '2025-08-03', '2027-08-03', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('13fd7ef9-1540-4c13-a968-7e3cd2accda1', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'CPR Certification', 'NY-70160', 'NY', '2022-11-15', '2024-11-15', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('3c77d7ed-0af6-4ad9-b977-0d777f3d54a8', '472950a5-9704-4530-a328-094f8a33ca4c', 'Pharmacy Technician', 'NY-40100', 'NY', '2023-08-01', '2025-08-01', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('3d4e4bc3-0387-4353-8f4a-9ff62b12d572', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'State License', 'CA-77391', 'CA', '2023-07-21', '2025-07-21', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('68fb7f83-6d18-41c1-a17b-1a46daaa04d1', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'Pharmacy Intern', 'CA-53472', 'CA', '2021-06-25', '2023-06-25', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('874ced95-bfc8-44a0-82ab-dc32169cddb8', '472950a5-9704-4530-a328-094f8a33ca4c', 'CPR Certification', 'NY-90471', 'NY', '2024-12-14', '2026-12-14', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('94de360c-d427-4e11-953a-1058f4c91e42', '6c449300-9476-4916-9550-b3760ab9ab1b', 'HIPAA Training', 'TX-5150', 'TX', '2025-06-30', '2027-06-30', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('a8a1f710-c6f0-4d83-b377-650ab253b358', '6c449300-9476-4916-9550-b3760ab9ab1b', 'HIPAA Training', 'CA-52762', 'CA', '2023-08-25', '2025-08-25', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('c71d50ec-8100-454a-8671-d2f7168f6cb5', '57b017b3-7414-4014-b107-3a588834d289', 'CPR Certification', 'IL-16338', 'IL', '2022-02-02', '2024-02-02', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('d037c2f7-5879-44a5-831a-e34ba1aedf2c', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'CPR Certification', 'NY-66380', 'NY', '2020-05-09', '2022-05-09', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('e9a69f0d-4825-498b-b1c1-1514a1d63712', '472950a5-9704-4530-a328-094f8a33ca4c', 'State License', 'NY-47156', 'NY', '2021-01-17', '2023-01-17', NULL, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `type` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `readAt` datetime DEFAULT NULL,
  `link` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `employeeId`, `type`, `title`, `message`, `isRead`, `readAt`, `link`, `metadata`, `createdAt`) VALUES
('07013c9e-f899-4dbc-975c-e18618ce063c', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'leave_approved', 'Leave Request Approved', 'Your leave request from 1/29/2026 to 2/3/2026 has been approved.', 0, NULL, '/leave-management', NULL, '2025-11-28 03:17:15'),
('2bd1d163-04dd-4704-8d81-3e32ec9621f0', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'training_assigned', 'New Training Assigned', 'You have been assigned a new training. Please complete it by the due date.', 0, NULL, '/training-compliance', NULL, '2025-11-27 01:54:23'),
('36204bca-a617-47d6-87f9-4d06e3b8c6e8', '472950a5-9704-4530-a328-094f8a33ca4c', 'training_assigned', 'New Training Assigned', 'You have been assigned a new training. Please complete it by the due date.', 0, NULL, '/training-compliance', NULL, '2025-11-27 01:53:07');

-- --------------------------------------------------------

--
-- Table structure for table `onboarding_tasks`
--

CREATE TABLE `onboarding_tasks` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `isRequired` tinyint(1) DEFAULT 1,
  `order` int(11) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `onboarding_tasks`
--

INSERT INTO `onboarding_tasks` (`id`, `title`, `description`, `category`, `isRequired`, `order`, `createdAt`, `updatedAt`) VALUES
('1bffc4e7-0f92-4a98-9a6b-3fb7c304c456', 'System Access Setup', 'Configure system access and credentials', 'Access', 1, 4, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('3676d95a-76ae-4ef7-bcf6-e1c2bfcef81a', 'Complete HIPAA Training', 'Complete mandatory HIPAA compliance training', 'Training', 1, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('97a0e67a-8585-403b-9a03-75f4f9692bd4', 'License Verification', 'Submit and verify professional licenses', 'Documentation', 1, 3, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d30e4517-e69d-4e22-9a8b-76212279e959', 'Acknowledge SOPs', 'Review and acknowledge all Standard Operating Procedures', 'Documentation', 1, 2, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

-- --------------------------------------------------------

--
-- Table structure for table `performance_evaluations`
--

CREATE TABLE `performance_evaluations` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `period` varchar(100) NOT NULL,
  `evaluatorId` varchar(36) NOT NULL,
  `ratings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `goals` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `documentUrl` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_licenses`
--

CREATE TABLE `pharmacy_licenses` (
  `id` varchar(36) NOT NULL,
  `licenseName` varchar(255) NOT NULL,
  `licenseNumber` varchar(255) NOT NULL,
  `state` varchar(100) NOT NULL,
  `issueDate` date NOT NULL,
  `expirationDate` date NOT NULL,
  `documentUrl` text DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `notes` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pharmacy_licenses`
--

INSERT INTO `pharmacy_licenses` (`id`, `licenseName`, `licenseNumber`, `state`, `issueDate`, `expirationDate`, `documentUrl`, `isActive`, `notes`, `createdAt`, `updatedAt`) VALUES
('0d7fffe9-cce9-4ccf-97db-92467ed82fbd', 'Compounding License', 'PH-208982', 'FL', '2022-02-20', '2023-02-20', 'https://example.com/licenses/42ce1d9e-d5d9-4067-bf58-59de332b27ef.pdf', 1, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('3bafa329-61cc-4795-8e86-2f8b9fab35f1', 'Compounding License', 'PH-470751', 'NY', '2024-08-01', '2025-08-01', 'https://example.com/licenses/d463d081-7744-4477-a515-8cdd042c0cf1.pdf', 1, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('4c08045e-72ab-4262-90c7-825e7fc73259', 'State Pharmacy License', 'PH-703175', 'IL', '2020-12-30', '2021-12-30', 'https://example.com/licenses/ac52cfa8-cfb1-4339-a001-0e5d2cbc58e1.pdf', 1, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('5b1cb429-6158-417b-b34b-e87eb8f31663', 'Controlled Substance License', 'PH-467200', 'NY', '2020-05-07', '2021-05-07', 'https://example.com/licenses/dbe5c171-58f3-4829-9b7a-81e7e8170a58.pdf', 1, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('757145e1-95eb-4748-adc3-d28ac5df591a', 'Compounding License', 'PH-877822', 'IL', '2021-11-29', '2022-11-29', 'https://example.com/licenses/81603bb1-058e-47df-afb8-30fec45fba28.pdf', 1, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('ab0af243-9459-4c7b-87af-b1c49f0bab79', 'Controlled Substance License', 'PH-88246', 'NY', '2024-08-09', '2025-08-09', 'https://example.com/licenses/492705f9-e68e-4d4d-9d23-fd7b6317f8a7.pdf', 1, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('af3534ef-03a6-4eb3-8ca6-a5e4ffc4efc0', 'DEA Registration', 'PH-191116', 'CA', '2025-11-12', '2026-11-12', 'https://example.com/licenses/46760976-d1a3-462e-bda0-2eb6362fea2d.pdf', 1, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('ef70015f-42b9-42e0-9b67-4e3b917cc7e3', 'Controlled Substance License', 'PH-492322', 'CA', '2023-10-14', '2024-10-14', 'https://example.com/licenses/75b19f0f-4685-4ccc-877c-3ffa722c6bdf.pdf', 1, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('f66f8d29-4083-4812-96f8-5febcde2f629', 'Business License', 'PH-740895', 'CA', '2025-09-06', '2026-09-06', 'https://example.com/licenses/74826599-a9b0-4ad5-bb19-19853d2946d0.pdf', 1, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('f879c864-b26a-4a11-b84f-d741fd337ecc', 'Controlled Substance License', 'PH-545983', 'TX', '2022-11-22', '2023-11-22', 'https://example.com/licenses/aac64300-47cf-4c84-80a6-4ee4b31b1107.pdf', 1, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39');

-- --------------------------------------------------------

--
-- Table structure for table `policies`
--

CREATE TABLE `policies` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `documentUrl` text DEFAULT NULL,
  `version` varchar(50) DEFAULT '1.0',
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `policies`
--

INSERT INTO `policies` (`id`, `title`, `description`, `category`, `documentUrl`, `version`, `isActive`, `createdAt`, `updatedAt`) VALUES
('38e35135-69ce-46a5-b528-25935f1ece3a', 'Safety Protocol', 'Workplace safety and emergency procedures', 'Safety', NULL, '3.0', 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('6acbe686-02a5-45e6-ac39-f473a7dde1c0', 'Data Privacy Policy', 'Official data privacy policy for all employees', 'IT', 'https://example.com/policies/data-privacy-policy.pdf', '1.0', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('6cf9b09b-96be-4cca-902b-8cd07782121a', 'Dress Code Policy', 'Official dress code policy for all employees', 'Compliance', 'https://example.com/policies/dress-code-policy.pdf', '1.0', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('8046bab9-4bd2-4775-b87d-092d7f6e1e83', 'Workplace Safety Policy', 'Official workplace safety policy for all employees', 'IT', 'https://example.com/policies/workplace-safety-policy.pdf', '1.0', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('8849d2e3-c292-4439-9694-f11de9f16693', 'Employee Handbook', 'Comprehensive employee handbook and guidelines', 'HR', NULL, '2024.1', 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('92d89746-9460-4021-a6e2-c7460a7f5f7c', 'Drug-Free Workplace Policy', 'Official drug-free workplace policy for all employees', 'Safety', 'https://example.com/policies/drug-free-workplace-policy.pdf', '1.0', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('9cd9ef92-c135-4cfb-8f2e-8a85ce2724e3', 'Employee Code of Conduct', 'Official employee code of conduct for all employees', 'HR', 'https://example.com/policies/employee-code-of-conduct.pdf', '1.0', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', 'Compounding SOP', 'Standard operating procedures for pharmaceutical compounding', 'SOP', NULL, '1.5', 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('cfad7f6e-14c3-497e-aced-8b3825ca52da', 'Remote Work Policy', 'Official remote work policy for all employees', 'HR', 'https://example.com/policies/remote-work-policy.pdf', '1.0', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('d0e2eaf6-413d-46cc-b21e-24d3eb26705d', 'HIPAA Privacy Policy', 'Patient privacy and HIPAA compliance policy', 'HIPAA', NULL, '2.1', 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d8c1190c-f84e-4cf1-8829-25ebae11099e', 'Social Media Policy', 'Official social media policy for all employees', 'Safety', 'https://example.com/policies/social-media-policy.pdf', '1.0', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('ff8bfd03-5305-4b2f-80e2-1ddffa2832c9', 'Harassment Prevention Policy', 'Official harassment prevention policy for all employees', 'Operations', 'https://example.com/policies/harassment-prevention-policy.pdf', '1.0', 1, '2025-11-28 00:09:40', '2025-11-28 00:09:40');

-- --------------------------------------------------------

--
-- Table structure for table `pto_balances`
--

CREATE TABLE `pto_balances` (
  `id` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `year` int(11) NOT NULL,
  `totalPtoBalance` decimal(6,2) DEFAULT 0.00,
  `rolloverHours` decimal(6,2) DEFAULT 0.00,
  `pendingHours` decimal(6,2) DEFAULT 0.00,
  `approvedHours` decimal(6,2) DEFAULT 0.00,
  `usedHours` decimal(6,2) DEFAULT 0.00,
  `remainingBalance` decimal(6,2) DEFAULT 0.00,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pto_balances`
--

INSERT INTO `pto_balances` (`id`, `employeeId`, `year`, `totalPtoBalance`, `rolloverHours`, `pendingHours`, `approvedHours`, `usedHours`, `remainingBalance`, `createdAt`, `updatedAt`) VALUES
('2437f36f-d8fb-4784-a1c6-821918fdb34c', '472950a5-9704-4530-a328-094f8a33ca4c', 2025, 109.00, 0.00, 1.00, 6.00, 32.00, 70.00, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('667d8ee8-12eb-4917-8c94-2ab955abacce', '57b017b3-7414-4014-b107-3a588834d289', 2025, 81.00, 0.00, 17.00, 0.00, 44.00, 20.00, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('7d209f24-e7e2-48f5-ab6b-36e6a9ed297e', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 2025, 94.00, 0.00, 11.00, 2.00, 7.00, 74.00, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('84163da2-2d1a-4160-95c3-8eb22db6cbd9', '8abcab26-c588-4ca3-be20-a68ea71759e9', 2025, 89.00, 0.00, 5.00, 1.00, 33.00, 50.00, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('c145516e-7f1b-4d67-a798-bcdc9d415c86', '6c449300-9476-4916-9550-b3760ab9ab1b', 2025, 91.00, 0.00, 0.00, 8.00, 31.00, 52.00, '2025-11-28 00:09:40', '2025-11-28 00:09:40'),
('c6d1f4d0-dfef-4f5f-99ed-d6c68f43b9b2', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 2025, 106.00, 0.00, 6.00, 9.00, 52.00, 39.00, '2025-11-28 00:09:40', '2025-11-28 00:09:40');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `permissions`, `createdAt`, `updatedAt`) VALUES
('18e959c9-22af-4b1a-8271-da495c3e8b93', 'Lead Technician', 'Supervisor/manager for technical departments. Oversees department operations, approves department PTO, manages schedules.', '{\"employees\":[\"read\"],\"licenses\":[\"read\"],\"pharmacy_licenses\":[\"read\"],\"training\":[\"read\",\"assign\"],\"scheduling\":[\"create\",\"read\",\"update\"],\"leave\":[\"read\",\"approve\",\"reject\"],\"onboarding\":[\"read\",\"update\"],\"evaluations\":[\"read\",\"update\"],\"incidents\":[\"create\",\"read\",\"update\"],\"attendance\":[\"read\"],\"documents\":[\"read\",\"approve\"],\"policies\":[\"read\"]}', '2025-11-26 02:20:52', '2025-11-26 02:20:52'),
('cca61a07-12eb-4d64-93a8-dbdf69c1eaaa', 'Employee', 'Basic employee access. Can view own information, submit requests, and complete training.', '{\"employees\":[],\"licenses\":[],\"training\":[],\"scheduling\":[\"read\"],\"leave\":[\"create\",\"read\"],\"attendance\":[\"create\",\"read\"],\"documents\":[\"read\",\"create\"],\"policies\":[\"read\"],\"dashboard\":[],\"my_trainings\":[\"read\"]}', '2025-11-27 23:08:57', '2025-11-28 04:15:55'),
('e206a38b-a514-4c21-8ccd-cc6c70daa891', 'Admin', 'Full system access. Can manage all employees, departments, roles, and permissions. Has complete CRUD access to all modules.', '{\"employees\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"approve\",\"reject\"],\"roles\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"approve\",\"reject\"],\"departments\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"reject\",\"approve\"],\"licenses\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"approve\",\"reject\"],\"pharmacy_licenses\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"approve\",\"reject\"],\"training\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"approve\",\"reject\"],\"scheduling\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"approve\",\"reject\"],\"leave\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"approve\",\"reject\"],\"attendance\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"approve\",\"reject\"],\"documents\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"approve\",\"reject\"],\"policies\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"approve\",\"reject\"],\"settings\":[\"create\",\"read\",\"update\",\"delete\",\"assign\",\"reject\",\"approve\"],\"dashboard\":[\"read\",\"create\",\"update\",\"delete\",\"assign\",\"approve\",\"reject\"],\"my_trainings\":[]}', '2025-11-26 02:20:52', '2025-11-28 03:41:52'),
('e69990bf-4026-45cc-8b0a-5211e571de10', 'HR', 'HR operations. Can manage employees, view reports, and assign permissions.', '{\"employees\":[\"create\",\"read\",\"update\"],\"roles\":[\"read\"],\"departments\":[\"read\"],\"licenses\":[\"read\",\"update\"],\"pharmacy_licenses\":[\"read\"],\"training\":[\"create\",\"read\",\"update\",\"assign\"],\"scheduling\":[\"read\"],\"leave\":[\"read\",\"approve\",\"reject\"],\"attendance\":[\"read\"],\"documents\":[\"read\",\"approve\",\"reject\"],\"policies\":[\"read\",\"update\"],\"dashboard\":[\"read\"]}', '2025-11-27 23:08:57', '2025-11-28 00:09:28');

-- --------------------------------------------------------

--
-- Table structure for table `shifts`
--

CREATE TABLE `shifts` (
  `id` varchar(36) NOT NULL,
  `date` date NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `departmentId` varchar(36) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shifts`
--

INSERT INTO `shifts` (`id`, `date`, `startTime`, `endTime`, `departmentId`, `role`, `notes`, `createdAt`, `updatedAt`) VALUES
('0467e6e9-4df4-47e5-9b08-b138c7a62bb1', '2025-12-09', '2025-12-09 03:00:00', '2025-12-09 11:00:00', '0d987e62-ca44-11f0-8943-3448ed0ea1e2', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('0e24b3dd-615e-4b8f-85a3-188acdcebfc3', '2025-11-16', '2025-11-17 08:00:00', '2025-11-17 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('16ba06d2-5b70-4d72-a6d3-ec30a92ba2bf', '2025-11-29', '2025-11-29 03:00:00', '2025-11-29 11:00:00', '0d987e62-ca44-11f0-8943-3448ed0ea1e2', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('1f9e93f3-7fe6-4812-8d5d-bb1674d58a97', '2025-12-05', '2025-12-05 03:00:00', '2025-12-05 11:00:00', '0d987e62-ca44-11f0-8943-3448ed0ea1e2', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('2a5b59b0-b7e9-4f57-9007-428170a5ec68', '2025-12-03', '2025-12-03 03:00:00', '2025-12-03 11:00:00', 'a1363655-8191-4aac-83d7-4afa3f033529', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('2bcae2ec-9374-42b7-988c-01ebe2f977ef', '2025-11-28', '2025-11-28 03:00:00', '2025-11-28 11:00:00', '0d981c8f-ca44-11f0-8943-3448ed0ea1e2', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('2d744327-863d-4a79-b173-00e4dc42f7ea', '2025-12-12', '2025-12-13 08:00:00', '2025-12-13 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('2f4f5271-1add-452e-bc15-4b20553ea96b', '2025-12-01', '2025-12-02 08:00:00', '2025-12-02 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('33ef8efe-f29a-4683-8d11-7081d9679c4c', '2025-12-10', '2025-12-10 03:00:00', '2025-12-10 11:00:00', '0d981c8f-ca44-11f0-8943-3448ed0ea1e2', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('39f597d9-1576-466e-9fd5-bd80f3fbea7e', '2025-12-08', '2025-12-08 03:00:00', '2025-12-08 11:00:00', '0d987e62-ca44-11f0-8943-3448ed0ea1e2', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('3aa5e815-b25b-4501-9198-c7dfb1174c60', '2025-12-16', '2025-12-16 01:00:00', '2025-12-16 09:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('3dfcf1d9-f347-4f8d-9f16-3587e558ff8b', '2025-11-20', '2025-11-21 08:00:00', '2025-11-21 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('41ab61b5-0b8c-45ca-86de-a15ad4b22e4a', '2025-12-09', '2025-12-10 08:00:00', '2025-12-10 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('41b7129b-6af4-4cdf-ac8f-060e18438264', '2025-12-25', '2025-12-25 09:00:00', '2025-12-25 17:00:00', '0d981c8f-ca44-11f0-8943-3448ed0ea1e2', NULL, 'Weekend shift - reduced staffing', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('45491744-f0c0-435f-9e6c-4af4666ae398', '2025-11-28', '2025-11-28 08:00:00', '2025-11-28 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-28 00:16:13'),
('4e1b0bef-d251-4c86-8a0d-d621fd4e35ac', '2025-12-06', '2025-12-07 08:00:00', '2025-12-07 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('56e79d72-d54b-4712-a4aa-80a84aefb0c5', '2025-12-01', '2025-12-01 11:00:00', '2025-12-01 19:00:00', 'ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('598321de-2c77-4a62-9a56-f3f70600eb48', '2025-12-08', '2025-12-09 08:00:00', '2025-12-09 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('6023e62b-576e-4e55-8b43-dfdbf20bf73c', '2025-12-14', '2025-12-14 11:00:00', '2025-12-14 19:00:00', '0d981c8f-ca44-11f0-8943-3448ed0ea1e2', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('63ffea0e-4be8-44d9-8d13-88f90ac2d81d', '2025-11-19', '2025-11-19 09:00:00', '2025-11-19 17:00:00', 'pharmacy', NULL, NULL, '2025-11-19 01:17:39', '2025-11-19 01:17:39'),
('6eed4b0e-84f9-49cf-a083-691127c09bec', '2025-12-24', '2025-12-24 11:00:00', '2025-12-24 19:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('718d6aec-7876-4e36-ba98-a386712e2c32', '2025-12-07', '2025-12-08 08:00:00', '2025-12-08 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('726a80ca-f533-4df4-9191-c3368cd7a25f', '2025-12-18', '2025-12-18 11:00:00', '2025-12-18 19:00:00', 'ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', NULL, 'Weekend shift - reduced staffing', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('788d19f6-b601-4b10-a820-d3384b62c16e', '2025-11-23', '2025-11-24 08:00:00', '2025-11-24 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('7b40a86d-c434-4131-9f04-23df5349ea3c', '2025-11-17', '2025-11-18 08:00:00', '2025-11-18 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('7b70dd85-95a2-4d17-a114-672e2c340831', '2025-12-21', '2025-12-21 01:00:00', '2025-12-21 09:00:00', 'ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('8750bf3c-1563-4d9d-bc21-abe40841b5a2', '2025-12-07', '2025-12-07 01:00:00', '2025-12-07 09:00:00', '0d987e62-ca44-11f0-8943-3448ed0ea1e2', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('87efc6e9-d667-46f6-a453-dbfb32a5ab90', '2025-11-30', '2025-11-30 03:00:00', '2025-11-30 11:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('8daf4005-4c6d-4131-910a-046cb4476e55', '2025-11-22', '2025-11-23 08:00:00', '2025-11-23 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('8ec9f12e-d20c-4650-894a-2622cb7ab486', '2025-12-17', '2025-12-17 11:00:00', '2025-12-17 19:00:00', 'ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('965593ad-eb4e-43c3-a961-bceebc22c1e3', '2025-12-06', '2025-12-06 01:00:00', '2025-12-06 09:00:00', 'a1363655-8191-4aac-83d7-4afa3f033529', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('a2afd5bb-0583-4259-94d5-811249127187', '2025-11-19', '2025-11-20 08:00:00', '2025-11-20 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a7236b2a-91c7-4122-937f-7a70fcbcb66c', '2025-12-02', '2025-12-03 08:00:00', '2025-12-03 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a881c582-ff3c-43c1-98c3-6c90157c5360', '2025-12-05', '2025-12-06 08:00:00', '2025-12-06 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ae37bb0a-db03-4ccc-b37d-89a233cdfabe', '2025-11-25', '2025-11-26 08:00:00', '2025-11-26 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('aeadb611-b031-49b4-b123-0fdd74e349b4', '2025-11-27', '2025-11-28 08:00:00', '2025-11-28 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('b2d046c0-c6b7-41f2-95a9-347a07f32acf', '2025-12-15', '2025-12-15 01:00:00', '2025-12-15 09:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('c1748871-7302-468a-a15b-f91f6dfb3a59', '2025-11-29', '2025-11-30 08:00:00', '2025-11-30 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('c2554053-2e53-45cb-bfc8-cadb61289fba', '2025-12-04', '2025-12-04 09:00:00', '2025-12-04 17:00:00', '0d987e62-ca44-11f0-8943-3448ed0ea1e2', NULL, 'Weekend shift - reduced staffing', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('c4e4038e-e93a-48f0-ad81-4afa7524fe49', '2025-12-11', '2025-12-12 08:00:00', '2025-12-12 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('c7b0ed9e-109d-4c51-9ea1-bfb133f7c92f', '2025-11-24', '2025-11-25 08:00:00', '2025-11-25 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('c7b862ea-bcc0-41a1-85a5-1fe66ba11cd0', '2025-12-20', '2025-12-20 09:00:00', '2025-12-20 17:00:00', '0d981c8f-ca44-11f0-8943-3448ed0ea1e2', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('c838ca8f-9653-4f2e-86cf-372dc6032a97', '2025-12-13', '2025-12-13 01:00:00', '2025-12-13 09:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('c8978b14-3a87-4b0a-a352-c0b54e2bc583', '2025-11-27', '2025-11-27 09:00:00', '2025-11-27 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, 'Weekend shift - reduced staffing', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('ccb95402-2031-4d27-a17d-435fc425e6b8', '2025-12-10', '2025-12-11 08:00:00', '2025-12-11 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ce9c18a5-921a-4c81-8ba9-2be577aff42e', '2025-11-26', '2025-11-27 08:00:00', '2025-11-27 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d0e47cd1-4a5d-46bf-a37a-5e2725597ffc', '2025-12-04', '2025-12-05 08:00:00', '2025-12-05 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d6406a76-7da0-418f-b26a-99f33f00318e', '2025-12-23', '2025-12-23 03:00:00', '2025-12-23 11:00:00', '0d987e62-ca44-11f0-8943-3448ed0ea1e2', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('dbfccea4-4d86-46df-b172-dd38cdec95a3', '2025-11-21', '2025-11-22 08:00:00', '2025-11-22 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('dcf8dbd6-3225-4cde-bd06-5015f8e24bae', '2025-12-19', '2025-12-19 11:00:00', '2025-12-19 19:00:00', '0d987e62-ca44-11f0-8943-3448ed0ea1e2', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('e6091f97-7124-4f70-ba89-ad8ca4391958', '2025-12-11', '2025-12-11 09:00:00', '2025-12-11 17:00:00', 'ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', NULL, 'Weekend shift - reduced staffing', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('e780ed1b-498a-4dc8-bf8c-059aaa1d051e', '2025-11-18', '2025-11-19 08:00:00', '2025-11-19 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ec58f991-5f83-4766-9304-c5a515dfed7b', '2025-12-12', '2025-12-12 01:00:00', '2025-12-12 09:00:00', 'a1363655-8191-4aac-83d7-4afa3f033529', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('edf09fe3-e8bc-4e97-b9b6-c47f85fb7d47', '2025-12-02', '2025-12-02 03:00:00', '2025-12-02 11:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('f38d976e-fa1d-400e-8c77-72272c191498', '2025-12-22', '2025-12-22 03:00:00', '2025-12-22 11:00:00', 'ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('f7419006-f972-4b0b-b4fe-edfa6a08273c', '2025-12-03', '2025-12-04 08:00:00', '2025-12-04 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f7b770b4-4e7b-4cc0-8786-c0af7eae0c73', '2025-11-30', '2025-12-01 08:00:00', '2025-12-01 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('facbfe59-6bf2-4783-84ed-949ed2ffc26e', '2025-11-15', '2025-11-16 08:00:00', '2025-11-16 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ff80ccc5-cfd5-460f-b2fd-32ac10af06b2', '2025-12-26', '2025-12-26 03:00:00', '2025-12-26 11:00:00', 'ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39');

-- --------------------------------------------------------

--
-- Table structure for table `shift_assignments`
--

CREATE TABLE `shift_assignments` (
  `id` varchar(36) NOT NULL,
  `shiftId` varchar(36) NOT NULL,
  `employeeId` varchar(36) NOT NULL,
  `status` varchar(50) DEFAULT 'scheduled',
  `clockIn` datetime DEFAULT NULL,
  `clockOut` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shift_assignments`
--

INSERT INTO `shift_assignments` (`id`, `shiftId`, `employeeId`, `status`, `clockIn`, `clockOut`, `createdAt`, `updatedAt`) VALUES
('0561d4b7-565f-474f-ab6a-d4ce03c333d8', '6023e62b-576e-4e55-8b43-dfdbf20bf73c', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'scheduled', '2025-08-26 17:38:01', '2025-08-27 01:38:01', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('0ed95454-36e7-4db3-9ddf-6956940fa6d0', 'ec58f991-5f83-4766-9304-c5a515dfed7b', '472950a5-9704-4530-a328-094f8a33ca4c', 'scheduled', '2024-07-09 20:30:23', '2024-07-10 04:30:23', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('125d5045-f2d1-428c-81a3-a9bd4815b3eb', '33ef8efe-f29a-4683-8d11-7081d9679c4c', '6c449300-9476-4916-9550-b3760ab9ab1b', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('1de5bb7f-b821-432f-853d-52551ea246b7', 'edf09fe3-e8bc-4e97-b9b6-c47f85fb7d47', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'scheduled', '2025-05-30 11:44:10', '2025-05-30 19:44:10', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('21bbe6c7-675f-4d88-ae58-bdffc3aa21bb', '39f597d9-1576-466e-9fd5-bd80f3fbea7e', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', '2025-08-10 02:03:31', '2025-08-10 10:03:31', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('21e12bd8-54a7-47da-a387-5d7361fe4e96', 'e6091f97-7124-4f70-ba89-ad8ca4391958', '472950a5-9704-4530-a328-094f8a33ca4c', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('273eda5a-9dd3-4522-a6a8-8d0507bcb860', 'c838ca8f-9653-4f2e-86cf-372dc6032a97', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', '2024-03-27 19:35:41', '2024-03-28 03:35:41', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('28c4b76a-b3eb-4c0f-8c3d-d7f60f1181cc', '3aa5e815-b25b-4501-9198-c7dfb1174c60', '57b017b3-7414-4014-b107-3a588834d289', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('2b0f7bec-d344-4450-b1be-edf80dff5a2f', 'ec58f991-5f83-4766-9304-c5a515dfed7b', '57b017b3-7414-4014-b107-3a588834d289', 'scheduled', '2024-02-20 03:42:28', '2024-02-20 11:42:28', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('2dd7cc7f-2f63-4209-a4be-6b14feabcce2', '56e79d72-d54b-4712-a4aa-80a84aefb0c5', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('38832b64-431e-48ef-96f0-ac1a4d9398e1', '2a5b59b0-b7e9-4f57-9007-428170a5ec68', '6c449300-9476-4916-9550-b3760ab9ab1b', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('43d11782-2e29-4308-8545-a77dd9f2a643', '87efc6e9-d667-46f6-a453-dbfb32a5ab90', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', '2025-04-19 21:08:58', '2025-04-20 05:08:58', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('43e62c4c-67a7-44fd-9484-2907e031fe51', 'c838ca8f-9653-4f2e-86cf-372dc6032a97', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'scheduled', '2025-08-19 06:56:19', '2025-08-19 14:56:19', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('49ca07e7-da3a-4bab-b73e-bde179aa450e', 'c8978b14-3a87-4b0a-a352-c0b54e2bc583', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'scheduled', '2025-08-13 19:59:51', '2025-08-14 03:59:51', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('4ba2d992-acaf-41e7-8672-0f313e63303d', 'c2554053-2e53-45cb-bfc8-cadb61289fba', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'scheduled', '2025-10-22 00:32:20', '2025-10-22 08:32:20', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('594452fc-06fa-4ed5-aa9b-9ded57009942', '1f9e93f3-7fe6-4812-8d5d-bb1674d58a97', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'scheduled', '2024-10-02 00:12:14', '2024-10-02 08:12:14', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('596c2a7b-d60f-4c27-95d0-8552bb819c1a', 'b2d046c0-c6b7-41f2-95a9-347a07f32acf', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', '2024-12-11 10:53:33', '2024-12-11 18:53:33', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('59eb4ef7-bf85-4970-9e3d-dd702cd0d418', 'ff80ccc5-cfd5-460f-b2fd-32ac10af06b2', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('5b771d35-445e-444e-9c43-9f300c2a71d0', 'f38d976e-fa1d-400e-8c77-72272c191498', '472950a5-9704-4530-a328-094f8a33ca4c', 'scheduled', '2025-10-23 12:46:52', '2025-10-23 20:46:52', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('5dfb1d68-07f2-48dd-899e-4689ecccc3ac', 'ff80ccc5-cfd5-460f-b2fd-32ac10af06b2', '472950a5-9704-4530-a328-094f8a33ca4c', 'scheduled', '2024-09-03 07:40:12', '2024-09-03 15:40:12', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('63eee86b-213b-4198-a33f-0800ba175e50', 'c7b862ea-bcc0-41a1-85a5-1fe66ba11cd0', '472950a5-9704-4530-a328-094f8a33ca4c', 'scheduled', '2025-07-04 12:34:50', '2025-07-04 20:34:50', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('64c8b9c7-b5e2-4967-9d9a-4f44eccd9697', 'edf09fe3-e8bc-4e97-b9b6-c47f85fb7d47', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'scheduled', '2024-06-09 19:25:01', '2024-06-10 03:25:01', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('66e50b2e-8ce6-4818-b873-753ed38ec82d', 'f38d976e-fa1d-400e-8c77-72272c191498', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'scheduled', '2024-11-25 22:33:03', '2024-11-26 06:33:03', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('684b836b-82a6-4edf-947d-3bb75950514e', '8ec9f12e-d20c-4650-894a-2622cb7ab486', '472950a5-9704-4530-a328-094f8a33ca4c', 'scheduled', '2024-06-01 10:37:00', '2024-06-01 18:37:00', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('69c35844-927b-4666-8bf6-aad969a09657', '3aa5e815-b25b-4501-9198-c7dfb1174c60', '472950a5-9704-4530-a328-094f8a33ca4c', 'scheduled', '2024-05-17 14:46:04', '2024-05-17 22:46:04', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('73718c00-0ba9-4f45-8835-5405c582c5a7', '726a80ca-f533-4df4-9191-c3368cd7a25f', '472950a5-9704-4530-a328-094f8a33ca4c', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('77ce5bb8-653c-44ba-8c46-a408a13bb85e', '7b70dd85-95a2-4d17-a114-672e2c340831', '57b017b3-7414-4014-b107-3a588834d289', 'scheduled', '2024-02-03 21:22:19', '2024-02-04 05:22:19', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('79bac22c-7267-4254-955b-90fe4c476633', 'd6406a76-7da0-418f-b26a-99f33f00318e', '57b017b3-7414-4014-b107-3a588834d289', 'scheduled', '2025-03-27 05:15:56', '2025-03-27 13:15:56', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('882d8b2f-ab0c-48b9-bf85-856aac4171ed', 'dcf8dbd6-3225-4cde-bd06-5015f8e24bae', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', '2024-03-13 01:13:39', '2024-03-13 09:13:39', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('8b0d9686-5b83-4c21-b117-6bcca675b22c', '6eed4b0e-84f9-49cf-a083-691127c09bec', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('8d38158a-1be4-45b7-8761-335733106dfd', '41b7129b-6af4-4cdf-ac8f-060e18438264', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('91494ba1-81bb-4f99-a538-f43e4721a480', '726a80ca-f533-4df4-9191-c3368cd7a25f', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'scheduled', '2025-11-27 15:50:12', '2025-11-27 23:50:12', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('96bc5b9a-4cbd-43ab-a597-9855fadbe270', '87efc6e9-d667-46f6-a453-dbfb32a5ab90', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('97bf75b9-9bb6-4624-8228-2e66d14dbaf6', 'c7b862ea-bcc0-41a1-85a5-1fe66ba11cd0', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'scheduled', '2025-11-25 22:34:28', '2025-11-26 06:34:28', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('a121f330-8f7f-42a0-89f9-3ed3b91fbd01', '0467e6e9-4df4-47e5-9b08-b138c7a62bb1', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', '2025-10-08 02:22:40', '2025-10-08 10:22:40', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('a513455b-bc1c-47a2-bfb3-25a66d9649e1', '87efc6e9-d667-46f6-a453-dbfb32a5ab90', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'scheduled', '2025-05-07 16:19:03', '2025-05-08 00:19:03', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('a59bf081-0692-46f4-8fc9-49a01172d121', 'ec58f991-5f83-4766-9304-c5a515dfed7b', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'scheduled', '2025-10-30 05:07:59', '2025-10-30 13:07:59', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('b0ce7c83-b236-4f7b-a92d-1c921f498c19', '33ef8efe-f29a-4683-8d11-7081d9679c4c', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', '2025-06-13 02:03:33', '2025-06-13 10:03:33', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('b2fc4e39-e82d-4926-9552-f427f69e9e51', 'b2d046c0-c6b7-41f2-95a9-347a07f32acf', '472950a5-9704-4530-a328-094f8a33ca4c', 'scheduled', '2025-06-23 00:23:51', '2025-06-23 08:23:51', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('b96a6bd7-6f30-4db9-b31f-20d4152b03db', '7b70dd85-95a2-4d17-a114-672e2c340831', '472950a5-9704-4530-a328-094f8a33ca4c', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('bea92d5e-f7e3-4446-b556-bd2624f07a47', '6023e62b-576e-4e55-8b43-dfdbf20bf73c', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', '2024-09-04 22:04:26', '2024-09-05 06:04:26', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('bf2da27f-69dc-46bb-b39a-2e367bc946b5', '8750bf3c-1563-4d9d-bc21-abe40841b5a2', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'scheduled', '2025-10-18 09:32:43', '2025-10-18 17:32:43', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('c8fdb1ea-8c3b-4916-a650-6dddbd1e4fbd', '2bcae2ec-9374-42b7-988c-01ebe2f977ef', '6c449300-9476-4916-9550-b3760ab9ab1b', 'scheduled', '2025-06-17 20:12:22', '2025-06-18 04:12:22', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('d4825104-e215-4ed0-9121-f3ad847411c8', 'ff80ccc5-cfd5-460f-b2fd-32ac10af06b2', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', '2024-03-26 20:20:57', '2024-03-27 04:20:57', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('dcf9688e-fe5c-4e96-8597-dcd29fb59971', '965593ad-eb4e-43c3-a961-bceebc22c1e3', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('e072d247-333f-4d11-8a61-ae59520058f7', '3aa5e815-b25b-4501-9198-c7dfb1174c60', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'scheduled', '2025-08-08 01:55:13', '2025-08-08 09:55:13', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('e079d950-30cc-452c-ad67-8edfdd91554b', 'e6091f97-7124-4f70-ba89-ad8ca4391958', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', '2024-11-10 02:39:59', '2024-11-10 10:39:59', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('e9e31050-3824-4f9b-af80-d79409a5ae63', '6eed4b0e-84f9-49cf-a083-691127c09bec', '57b017b3-7414-4014-b107-3a588834d289', 'scheduled', '2024-06-26 03:07:47', '2024-06-26 11:07:47', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('eb15b1d3-73cd-41c0-b2b6-f6759ebf482a', 'c8978b14-3a87-4b0a-a352-c0b54e2bc583', '6c449300-9476-4916-9550-b3760ab9ab1b', 'scheduled', '2025-11-15 01:35:18', '2025-11-15 09:35:18', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('eb97d1f3-d0c2-49c3-a745-a273f2225c10', 'c2554053-2e53-45cb-bfc8-cadb61289fba', '6c449300-9476-4916-9550-b3760ab9ab1b', 'scheduled', '2024-12-19 23:47:49', '2024-12-20 07:47:49', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('ee622742-2a61-467b-b50e-622cd5bb2a94', '16ba06d2-5b70-4d72-a6d3-ec30a92ba2bf', '0788868b-90aa-43db-aa00-7b080c3fc3bc', 'scheduled', '2025-04-26 04:11:54', '2025-04-26 12:11:54', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('f1da96e4-270e-477d-b7f3-f57ad05c3443', '2bcae2ec-9374-42b7-988c-01ebe2f977ef', '57b017b3-7414-4014-b107-3a588834d289', 'scheduled', '2025-09-14 06:51:31', '2025-09-14 14:51:31', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('f4def69b-ccff-4204-bf22-81ce8e968cb4', '965593ad-eb4e-43c3-a961-bceebc22c1e3', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'scheduled', '2024-09-14 06:10:53', '2024-09-14 14:10:53', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('f52be634-0693-40f5-9323-00273daeeeae', 'edf09fe3-e8bc-4e97-b9b6-c47f85fb7d47', '6c449300-9476-4916-9550-b3760ab9ab1b', 'scheduled', NULL, NULL, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('f9835d72-5a73-45bc-8ac1-f92566d84156', '16ba06d2-5b70-4d72-a6d3-ec30a92ba2bf', '472950a5-9704-4530-a328-094f8a33ca4c', 'scheduled', '2024-10-30 12:28:31', '2024-10-30 20:28:31', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('facd961a-145f-44d9-8b6a-b998024b5487', '33ef8efe-f29a-4683-8d11-7081d9679c4c', '38715efa-de7e-47e5-bf9d-fb272bcbe14a', 'scheduled', '2025-07-13 17:22:56', '2025-07-14 01:22:56', '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('ff15e4d7-e758-4d03-ae66-372d53030f72', 'f38d976e-fa1d-400e-8c77-72272c191498', '8abcab26-c588-4ca3-be20-a68ea71759e9', 'scheduled', '2025-02-04 15:16:35', '2025-02-04 23:16:35', '2025-11-28 00:09:39', '2025-11-28 00:09:39');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` varchar(36) NOT NULL,
  `settingKey` varchar(255) NOT NULL,
  `settingValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`settingValue`)),
  `description` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `settingKey`, `settingValue`, `description`, `createdAt`, `updatedAt`) VALUES
('7ea903e4-a37f-4dcb-8ec5-1a92878e1a83', 'sidebar_logo', '\"http://localhost:5000/uploads/file-1763509969246-600908526.png\"', 'Sidebar logo URL', '2025-11-19 04:52:49', '2025-11-19 04:52:49'),
('a184859d-26fc-4abb-9207-5af7a82849b3', 'sidebar_theme', '{\"backgroundColor\":\"#ffffff\",\"textColor\":\"#6b7280\",\"activeColor\":\"#27bcbb\",\"activeTextColor\":\"#ffffff\"}', 'Sidebar color theme settings', '2025-11-19 04:52:16', '2025-11-20 01:28:05');

-- --------------------------------------------------------

--
-- Table structure for table `trainings`
--

CREATE TABLE `trainings` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `isRequired` tinyint(1) DEFAULT 0,
  `supportsVideo` tinyint(1) DEFAULT 0,
  `supportsPDF` tinyint(1) DEFAULT 0,
  `supportsQuiz` tinyint(1) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `trainings`
--

INSERT INTO `trainings` (`id`, `title`, `description`, `category`, `duration`, `isRequired`, `supportsVideo`, `supportsPDF`, `supportsQuiz`, `createdAt`, `updatedAt`) VALUES
('0a05264a-3207-40db-a69a-1451e78c4455', 'Pharmacy Law and Ethics', 'Comprehensive training on pharmacy law and ethics', 'Compliance', 90, 1, 1, 1, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('2b08eab3-fe9c-44f7-b608-84914c8dbfd4', 'Compounding Best Practices', 'Comprehensive training on compounding best practices', 'Technical', 90, 0, 1, 1, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('30cda8d6-730f-448b-bba6-5090317f7be3', 'OSHA Workplace Safety', 'Comprehensive training on osha workplace safety', 'Safety', 180, 1, 1, 1, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('570dc884-9f3e-4594-a4fb-4a55f8fef134', 'Compounding Safety', 'Safety protocols for pharmaceutical compounding', 'Safety', 45, 1, 0, 0, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('77114c70-7bfb-47f9-a487-36b58641228d', 'Inventory Management', 'Comprehensive training on inventory management', 'Operations', 60, 0, 1, 1, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('9c1e6ce1-4a72-4771-a6da-aaef545cc136', 'Pharmaceutical Calculations', 'Advanced pharmaceutical calculations and measurements', 'Technical', 90, 0, 0, 0, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('b1d42333-bb0f-4ccc-b646-2105d2b50510', 'HIPAA Compliance Training', 'Comprehensive training on hipaa compliance training', 'Compliance', 60, 1, 1, 1, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('ba31fd19-2665-419b-a095-676613510a2a', 'Waste Management', 'Proper handling and disposal of pharmaceutical waste', 'Safety', 30, 1, 0, 0, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('c01cf454-0673-46ca-8906-98d466e98dba', 'Pharmacy Safety Protocols', 'Comprehensive training on pharmacy safety protocols', 'Safety', 120, 1, 1, 1, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('c401d8f6-2327-46be-80e4-3241c7082e20', 'Medication Error Prevention', 'Comprehensive training on medication error prevention', 'Safety', 75, 1, 1, 1, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39'),
('e1afe686-1867-4f54-a346-803bc2466351', 'Customer Service Excellence', 'Comprehensive training on customer service excellence', 'Soft Skills', 45, 0, 1, 1, 1, '2025-11-28 00:09:39', '2025-11-28 00:09:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_clockIn` (`clockIn`),
  ADD KEY `idx_shiftAssignmentId` (`shiftAssignmentId`);

--
-- Indexes for table `clock_in_devices`
--
ALTER TABLE `clock_in_devices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ipAddress` (`ipAddress`),
  ADD KEY `idx_deviceId` (`deviceId`),
  ADD KEY `idx_isActive` (`isActive`);

--
-- Indexes for table `corrective_actions`
--
ALTER TABLE `corrective_actions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_incidentId` (`incidentId`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_dueDate` (`dueDate`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_type` (`type`);

--
-- Indexes for table `emergency_contacts`
--
ALTER TABLE `emergency_contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employeeId` (`employeeId`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employeeId` (`employeeId`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_departmentId` (`departmentId`),
  ADD KEY `idx_isActive` (`isActive`);

--
-- Indexes for table `employee_document_uploads`
--
ALTER TABLE `employee_document_uploads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_approvalStatus` (`approvalStatus`),
  ADD KEY `idx_hrDocumentId` (`hrDocumentId`);

--
-- Indexes for table `employee_onboarding_tasks`
--
ALTER TABLE `employee_onboarding_tasks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_task` (`employeeId`,`taskId`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_taskId` (`taskId`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `employee_permissions`
--
ALTER TABLE `employee_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_permissions` (`employeeId`),
  ADD KEY `idx_employeeId` (`employeeId`);

--
-- Indexes for table `employee_policy_acks`
--
ALTER TABLE `employee_policy_acks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_policy` (`employeeId`,`policyId`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_policyId` (`policyId`);

--
-- Indexes for table `employee_roles`
--
ALTER TABLE `employee_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_role` (`employeeId`,`roleId`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_roleId` (`roleId`);

--
-- Indexes for table `employee_training_records`
--
ALTER TABLE `employee_training_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_trainingId` (`trainingId`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_dueDate` (`dueDate`);

--
-- Indexes for table `hr_documents`
--
ALTER TABLE `hr_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_documentType` (`documentType`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_isActive` (`isActive`);

--
-- Indexes for table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_severity` (`severity`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_startDate` (`startDate`),
  ADD KEY `idx_type` (`type`);

--
-- Indexes for table `licenses`
--
ALTER TABLE `licenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_expiryDate` (`expiryDate`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_isRead` (`isRead`),
  ADD KEY `idx_type` (`type`);

--
-- Indexes for table `onboarding_tasks`
--
ALTER TABLE `onboarding_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `performance_evaluations`
--
ALTER TABLE `performance_evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_period` (`period`);

--
-- Indexes for table `pharmacy_licenses`
--
ALTER TABLE `pharmacy_licenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_expirationDate` (`expirationDate`),
  ADD KEY `idx_isActive` (`isActive`),
  ADD KEY `idx_state` (`state`);

--
-- Indexes for table `policies`
--
ALTER TABLE `policies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `pto_balances`
--
ALTER TABLE `pto_balances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_year` (`employeeId`,`year`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_year` (`year`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_departmentId` (`departmentId`);

--
-- Indexes for table `shift_assignments`
--
ALTER TABLE `shift_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_shift_employee` (`shiftId`,`employeeId`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_shiftId` (`shiftId`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settingKey` (`settingKey`),
  ADD KEY `idx_settingKey` (`settingKey`);

--
-- Indexes for table `trainings`
--
ALTER TABLE `trainings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD CONSTRAINT `attendance_logs_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_logs_ibfk_2` FOREIGN KEY (`shiftAssignmentId`) REFERENCES `shift_assignments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `corrective_actions`
--
ALTER TABLE `corrective_actions`
  ADD CONSTRAINT `corrective_actions_ibfk_1` FOREIGN KEY (`incidentId`) REFERENCES `incidents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `corrective_actions_ibfk_2` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `emergency_contacts`
--
ALTER TABLE `emergency_contacts`
  ADD CONSTRAINT `emergency_contacts_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_document_uploads`
--
ALTER TABLE `employee_document_uploads`
  ADD CONSTRAINT `employee_document_uploads_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_document_uploads_ibfk_2` FOREIGN KEY (`hrDocumentId`) REFERENCES `hr_documents` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_onboarding_tasks`
--
ALTER TABLE `employee_onboarding_tasks`
  ADD CONSTRAINT `employee_onboarding_tasks_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_onboarding_tasks_ibfk_2` FOREIGN KEY (`taskId`) REFERENCES `onboarding_tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_permissions`
--
ALTER TABLE `employee_permissions`
  ADD CONSTRAINT `employee_permissions_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_policy_acks`
--
ALTER TABLE `employee_policy_acks`
  ADD CONSTRAINT `employee_policy_acks_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_policy_acks_ibfk_2` FOREIGN KEY (`policyId`) REFERENCES `policies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_roles`
--
ALTER TABLE `employee_roles`
  ADD CONSTRAINT `employee_roles_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_roles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_training_records`
--
ALTER TABLE `employee_training_records`
  ADD CONSTRAINT `employee_training_records_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_training_records_ibfk_2` FOREIGN KEY (`trainingId`) REFERENCES `trainings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `incidents`
--
ALTER TABLE `incidents`
  ADD CONSTRAINT `incidents_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `licenses`
--
ALTER TABLE `licenses`
  ADD CONSTRAINT `licenses_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `performance_evaluations`
--
ALTER TABLE `performance_evaluations`
  ADD CONSTRAINT `performance_evaluations_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pto_balances`
--
ALTER TABLE `pto_balances`
  ADD CONSTRAINT `pto_balances_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shift_assignments`
--
ALTER TABLE `shift_assignments`
  ADD CONSTRAINT `shift_assignments_ibfk_1` FOREIGN KEY (`shiftId`) REFERENCES `shifts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shift_assignments_ibfk_2` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
