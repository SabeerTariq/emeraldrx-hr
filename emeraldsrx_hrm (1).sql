-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 19, 2025 at 05:29 PM
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

--
-- Dumping data for table `corrective_actions`
--

INSERT INTO `corrective_actions` (`id`, `incidentId`, `employeeId`, `title`, `description`, `dueDate`, `completedAt`, `status`, `createdAt`, `updatedAt`) VALUES
('0c2c22c4-b0b3-447f-b85f-38ec760b42e0', 'fce17e0e-05eb-46d2-98b7-16303f1acd51', '5f94109d-7d2c-461a-991d-c233313ce128', 'Corrective Action for Incident 4', 'Required corrective action to address the incident.', '2025-12-18 00:00:00', NULL, 'pending', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('0fcc3d6b-d0b4-412d-ad8c-bf4df5fc209c', 'b4b76805-b6f3-4a75-952c-63980e2fb797', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'Corrective Action for Incident 2', 'Required corrective action to address the incident.', '2025-12-18 00:00:00', '2025-11-13 00:00:00', 'completed', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('10a99f09-a37b-4860-a6cc-8baa4b295432', 'f18aae78-d060-46ab-b788-54c991b47b6d', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'Corrective Action for Incident 5', 'Required corrective action to address the incident.', '2025-12-18 00:00:00', NULL, 'pending', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('22064fdc-50b1-42ad-b00d-dd4303819315', 'c727bf0d-29e7-43a4-8c7b-6be032573a45', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'Corrective Action for Incident 3', 'Required corrective action to address the incident.', '2025-12-18 00:00:00', NULL, 'pending', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('34a65ac4-d1d4-477c-96d2-e5e41f140431', '176776ac-bb02-4403-a08e-16213908e85c', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'Corrective Action for Incident 1', 'Required corrective action to address the incident.', '2025-12-18 00:00:00', '2025-11-13 00:00:00', 'completed', '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
('217552b1-00f0-4a91-8f12-4e6329915199', 'Pharmacy', 'Pharmacy operations and compounding', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a1363655-8191-4aac-83d7-4afa3f033529', 'Administration', 'Administrative functions', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('aa5ac0c2-c41e-4fda-afe8-0458039725ab', 'Compliance', 'Compliance and regulatory affairs', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', 'HR', 'Human Resources', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f05de07c-c4b9-11f0-b216-3448ed0ea1e2', 'Test Dept', 'Test', '2025-11-19 01:05:21', '2025-11-19 01:05:21');

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
('25d5e8e4-e7dc-41a6-96e9-f4ee828a96a7', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'Mary Williams', 'Parent', '555-1003', NULL, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('3790e29d-dfbb-43f2-9d04-84eb5b7059b7', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'Robert Johnson', 'Parent', '555-1002', NULL, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('3ac0df26-afd9-4102-94a1-5ad6fdf5919d', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'William Brown', 'Parent', '555-1009', NULL, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('7100601e-ffcb-41e8-b199-7239f15213a1', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'Mary Williams', 'Parent', '555-1008', NULL, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('717d01d2-b179-4a48-8384-08b13fbaef02', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'William Brown', 'Parent', '555-1004', NULL, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('79ce97eb-fb3c-4d30-bb40-e662153d6db2', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'Jane Smith', 'Parent', '555-1006', NULL, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('7af94e5c-5776-4247-bac6-ebaedff2bd61', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'John Doe', 'Spouse', '555-1000', NULL, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('80173d18-e75b-461d-bab7-c5449498b7d5', '5f94109d-7d2c-461a-991d-c233313ce128', 'John Doe', 'Parent', '555-1005', NULL, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('8fa6e8a8-ae97-41fa-acc3-6db060e6af3c', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'Jane Smith', 'Parent', '555-1001', NULL, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d9cd2084-aa3c-4a89-8ea3-43e74f00ef6e', '14da6ba5-e41c-4825-a468-e55144d233f6', 'Robert Johnson', 'Parent', '555-1007', NULL, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
  `password` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employeeId`, `firstName`, `lastName`, `email`, `phone`, `dateOfBirth`, `address`, `city`, `state`, `zipCode`, `hireDate`, `terminationDate`, `isActive`, `departmentId`, `password`, `createdAt`, `updatedAt`) VALUES
('14da6ba5-e41c-4825-a468-e55144d233f6', 'EMP008', 'James', 'Wilson', 'james.wilson@emeraldsrx.com', '555-0108', NULL, NULL, NULL, NULL, NULL, '2023-01-10', NULL, 1, '217552b1-00f0-4a91-8f12-4e6329915199', '$2a$10$VgwitjA4DrRVlHQKGQ53DOhysguT9.AX9IC6D103DKcsb6D0i3VCm', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('1f9112ef-6dbd-493a-b6ae-47526a04220e', 'EMP009', 'Lisa', 'Anderson', 'lisa.anderson@emeraldsrx.com', '555-0109', NULL, NULL, NULL, NULL, NULL, '2022-11-20', NULL, 1, 'aa5ac0c2-c41e-4fda-afe8-0458039725ab', '$2a$10$VgwitjA4DrRVlHQKGQ53DOhysguT9.AX9IC6D103DKcsb6D0i3VCm', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('38f43b2b-440d-4f4c-9016-a80cd074e167', 'EMP010', 'Christopher', 'Brown', 'christopher.brown@emeraldsrx.com', '555-0110', NULL, NULL, NULL, NULL, NULL, '2023-03-05', NULL, 1, '217552b1-00f0-4a91-8f12-4e6329915199', '$2a$10$VgwitjA4DrRVlHQKGQ53DOhysguT9.AX9IC6D103DKcsb6D0i3VCm', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('3f808a8a-d28b-4170-b749-1c3e5538e952', 'EMP004', 'David', 'Thompson', 'david.thompson@emeraldsrx.com', '555-0104', NULL, NULL, NULL, NULL, NULL, '2021-02-14', NULL, 1, '217552b1-00f0-4a91-8f12-4e6329915199', '$2a$10$VgwitjA4DrRVlHQKGQ53DOhysguT9.AX9IC6D103DKcsb6D0i3VCm', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('5f94109d-7d2c-461a-991d-c233313ce128', 'EMP006', 'Robert', 'Martinez', 'robert.martinez@emeraldsrx.com', '555-0106', NULL, NULL, NULL, NULL, NULL, '2022-07-15', NULL, 1, '217552b1-00f0-4a91-8f12-4e6329915199', '$2a$10$VgwitjA4DrRVlHQKGQ53DOhysguT9.AX9IC6D103DKcsb6D0i3VCm', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('71c6818d-8c95-468a-979c-62ff555ad2c7', 'EMP007', 'Amanda', 'Davis', 'amanda.davis@emeraldsrx.com', '555-0107', NULL, NULL, NULL, NULL, NULL, '2020-09-01', NULL, 1, 'a1363655-8191-4aac-83d7-4afa3f033529', '$2a$10$VgwitjA4DrRVlHQKGQ53DOhysguT9.AX9IC6D103DKcsb6D0i3VCm', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('87efcad0-6e83-4541-bff2-4c54cda978e3', 'EMP002', 'Michael', 'Chen', 'michael.chen@emeraldsrx.com', '555-0102', NULL, NULL, NULL, NULL, NULL, '2019-03-20', NULL, 1, 'aa5ac0c2-c41e-4fda-afe8-0458039725ab', '$2a$10$VgwitjA4DrRVlHQKGQ53DOhysguT9.AX9IC6D103DKcsb6D0i3VCm', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d832e4dc-f590-4dc4-9dc0-235afc267ec2', 'EMP003', 'Emily', 'Rodriguez', 'emily.rodriguez@emeraldsrx.com', '555-0103', NULL, NULL, NULL, NULL, NULL, '2018-06-10', NULL, 1, '217552b1-00f0-4a91-8f12-4e6329915199', '$2a$10$VgwitjA4DrRVlHQKGQ53DOhysguT9.AX9IC6D103DKcsb6D0i3VCm', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f4015be8-9d2a-4441-a532-4c58b6b682be', 'EMP005', 'Jessica', 'Williams', 'jessica.williams@emeraldsrx.com', '555-0105', NULL, NULL, NULL, NULL, NULL, '2022-05-01', NULL, 1, '217552b1-00f0-4a91-8f12-4e6329915199', '$2a$10$VgwitjA4DrRVlHQKGQ53DOhysguT9.AX9IC6D103DKcsb6D0i3VCm', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f50c3257-7329-4cbb-b21c-beddc84a3455', 'EMP001', 'Sarah', 'Johnson', 'sarah.johnson@emeraldsrx.com', '555-0101', NULL, NULL, NULL, NULL, NULL, '2020-01-15', NULL, 1, 'ef7b5eb2-16ae-46e1-816b-cbe5b09a0047', '$2a$10$VgwitjA4DrRVlHQKGQ53DOhysguT9.AX9IC6D103DKcsb6D0i3VCm', '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
('22f75d8f-0377-4fcc-b684-4406e60dd5ff', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'd30e4517-e69d-4e22-9a8b-76212279e959', 'in_progress', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('259f9920-2964-428d-bf81-1dbea4f8f302', '38f43b2b-440d-4f4c-9016-a80cd074e167', '97a0e67a-8585-403b-9a03-75f4f9692bd4', 'completed', '2025-10-16 00:00:00', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('32f11820-6925-46ac-9910-c2b0ecc9da6a', '1f9112ef-6dbd-493a-b6ae-47526a04220e', '1bffc4e7-0f92-4a98-9a6b-3fb7c304c456', 'pending', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('6b7739f0-5054-4497-aa4a-31faa7f630d5', '1f9112ef-6dbd-493a-b6ae-47526a04220e', '97a0e67a-8585-403b-9a03-75f4f9692bd4', 'completed', '2025-10-16 00:00:00', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('8de4ec22-e3f3-4140-936b-0b44f4891578', '38f43b2b-440d-4f4c-9016-a80cd074e167', '1bffc4e7-0f92-4a98-9a6b-3fb7c304c456', 'pending', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a1b551c4-d941-447c-b852-cc8931c713af', '1f9112ef-6dbd-493a-b6ae-47526a04220e', '3676d95a-76ae-4ef7-bcf6-e1c2bfcef81a', 'pending', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a4610161-7485-453f-96d1-387f454af5cc', '14da6ba5-e41c-4825-a468-e55144d233f6', '1bffc4e7-0f92-4a98-9a6b-3fb7c304c456', 'pending', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('cd8b6143-ca1e-4609-90a9-cddf3a00b55c', '38f43b2b-440d-4f4c-9016-a80cd074e167', '3676d95a-76ae-4ef7-bcf6-e1c2bfcef81a', 'pending', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('e086f3f3-9c3b-43cf-ab8d-915f096eb415', '14da6ba5-e41c-4825-a468-e55144d233f6', '97a0e67a-8585-403b-9a03-75f4f9692bd4', 'completed', '2025-10-16 00:00:00', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ee72ad09-f383-4152-b228-6941c58ada63', '14da6ba5-e41c-4825-a468-e55144d233f6', 'd30e4517-e69d-4e22-9a8b-76212279e959', 'in_progress', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f612c45b-b0a7-4d69-8fc0-20351867500c', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'd30e4517-e69d-4e22-9a8b-76212279e959', 'in_progress', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ff4da4df-386c-405c-995c-11b3032517e7', '14da6ba5-e41c-4825-a468-e55144d233f6', '3676d95a-76ae-4ef7-bcf6-e1c2bfcef81a', 'pending', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
('08cc0af0-a5fa-4de3-9065-598d4305ab40', '3f808a8a-d28b-4170-b749-1c3e5538e952', '8849d2e3-c292-4439-9694-f11de9f16693', '2024-07-09 00:00:00', '192.168.1.103', '2025-11-19 01:05:32'),
('0e4a85b0-7e21-40b8-8f51-b11f1b5a2ecc', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', '2024-04-09 00:00:00', '192.168.1.102', '2025-11-19 01:05:32'),
('10772a11-312a-45fe-a902-4b62ceb6e070', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', '2024-11-09 00:00:00', '192.168.1.109', '2025-11-19 01:05:32'),
('199ca317-447a-4053-8d16-9f9acf8c3579', '71c6818d-8c95-468a-979c-62ff555ad2c7', '38e35135-69ce-46a5-b528-25935f1ece3a', '2024-09-09 00:00:00', '192.168.1.106', '2025-11-19 01:05:32'),
('1adc6f52-1ae0-4491-824d-53b61a1ea409', '14da6ba5-e41c-4825-a468-e55144d233f6', '38e35135-69ce-46a5-b528-25935f1ece3a', '2024-10-09 00:00:00', '192.168.1.107', '2025-11-19 01:05:32'),
('24dc62e7-feb0-4196-9993-f2a468be5635', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', '8849d2e3-c292-4439-9694-f11de9f16693', '2024-06-09 00:00:00', '192.168.1.102', '2025-11-19 01:05:32'),
('28c9ecf7-c4fb-435c-ad19-ff40aefc8410', '14da6ba5-e41c-4825-a468-e55144d233f6', 'b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', '2024-09-09 00:00:00', '192.168.1.107', '2025-11-19 01:05:32'),
('2eae06f6-6581-4358-b351-22362c244286', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', '2024-06-09 00:00:00', '192.168.1.104', '2025-11-19 01:05:32'),
('2ff166f9-a784-47be-9a3b-be7d65f32fcd', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'd0e2eaf6-413d-46cc-b21e-24d3eb26705d', '2024-04-09 00:00:00', '192.168.1.103', '2025-11-19 01:05:32'),
('314f1c4a-3be6-444d-8457-84430024b7c0', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'd0e2eaf6-413d-46cc-b21e-24d3eb26705d', '2024-01-09 00:00:00', '192.168.1.100', '2025-11-19 01:05:32'),
('3186fd08-d06c-4823-bfcb-47cc091ebc74', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '38e35135-69ce-46a5-b528-25935f1ece3a', '2024-03-09 00:00:00', '192.168.1.100', '2025-11-19 01:05:32'),
('3a96b41d-b940-4758-a079-5ee4bddad32e', 'f4015be8-9d2a-4441-a532-4c58b6b682be', '38e35135-69ce-46a5-b528-25935f1ece3a', '2024-07-09 00:00:00', '192.168.1.104', '2025-11-19 01:05:32'),
('3d9d459c-51d0-4adc-aae1-d4b3a23dc7ff', 'f4015be8-9d2a-4441-a532-4c58b6b682be', '8849d2e3-c292-4439-9694-f11de9f16693', '2024-08-09 00:00:00', '192.168.1.104', '2025-11-19 01:05:32'),
('3fddcdeb-3149-4f03-a8b7-539792e76317', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', '2024-03-09 00:00:00', '192.168.1.101', '2025-11-19 01:05:32'),
('42a34f2e-2247-4183-85b9-44a35aecfedf', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', '2024-10-09 00:00:00', '192.168.1.108', '2025-11-19 01:05:32'),
('43e16013-2d46-4f57-804b-ebec9b671091', '87efcad0-6e83-4541-bff2-4c54cda978e3', '38e35135-69ce-46a5-b528-25935f1ece3a', '2024-04-09 00:00:00', '192.168.1.101', '2025-11-19 01:05:32'),
('46e90cfc-d464-44dc-b8c1-5840d1ce5e6d', '5f94109d-7d2c-461a-991d-c233313ce128', 'd0e2eaf6-413d-46cc-b21e-24d3eb26705d', '2024-06-09 00:00:00', '192.168.1.105', '2025-11-19 01:05:32'),
('481dcaba-1200-49f2-975d-d060b2f42e3e', '71c6818d-8c95-468a-979c-62ff555ad2c7', '8849d2e3-c292-4439-9694-f11de9f16693', '2024-10-09 00:00:00', '192.168.1.106', '2025-11-19 01:05:32'),
('4a53d937-c32f-462d-810c-40dcec34717d', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'd0e2eaf6-413d-46cc-b21e-24d3eb26705d', '2024-07-09 00:00:00', '192.168.1.106', '2025-11-19 01:05:32'),
('5b9ea12f-0d70-42c1-b8ad-82c825341697', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'd0e2eaf6-413d-46cc-b21e-24d3eb26705d', '2024-09-09 00:00:00', '192.168.1.108', '2025-11-19 01:05:32'),
('5eedfe60-5f6d-4407-8f3a-b8d761dd8339', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'd0e2eaf6-413d-46cc-b21e-24d3eb26705d', '2024-03-09 00:00:00', '192.168.1.102', '2025-11-19 01:05:32'),
('6587ed0b-9348-4d14-9356-2bc48c4ab168', '1f9112ef-6dbd-493a-b6ae-47526a04220e', '8849d2e3-c292-4439-9694-f11de9f16693', '2024-12-09 00:00:00', '192.168.1.108', '2025-11-19 01:05:32'),
('69108cca-cd64-4e0d-94ce-f87f59222ef9', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', '2024-02-09 00:00:00', '192.168.1.100', '2025-11-19 01:05:32'),
('6f3a6487-c9c7-4926-96ea-3d7a97f616a9', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'd0e2eaf6-413d-46cc-b21e-24d3eb26705d', '2024-02-09 00:00:00', '192.168.1.101', '2025-11-19 01:05:32'),
('80601d8d-2358-419d-a755-3345f0256758', '5f94109d-7d2c-461a-991d-c233313ce128', '38e35135-69ce-46a5-b528-25935f1ece3a', '2024-08-09 00:00:00', '192.168.1.105', '2025-11-19 01:05:32'),
('81816536-87c1-4535-8ff0-dcf66afe357d', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'd0e2eaf6-413d-46cc-b21e-24d3eb26705d', '2024-05-09 00:00:00', '192.168.1.104', '2025-11-19 01:05:32'),
('873f82d2-e0d9-4da0-a021-5ce328f25d9d', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', '2024-08-09 00:00:00', '192.168.1.106', '2025-11-19 01:05:32'),
('950923d8-2f98-4cc3-9a35-1e9d0792092f', '87efcad0-6e83-4541-bff2-4c54cda978e3', '8849d2e3-c292-4439-9694-f11de9f16693', '2024-05-09 00:00:00', '192.168.1.101', '2025-11-19 01:05:32'),
('96ddb71f-cc21-46d4-9e20-c808bbba0681', '14da6ba5-e41c-4825-a468-e55144d233f6', 'd0e2eaf6-413d-46cc-b21e-24d3eb26705d', '2024-08-09 00:00:00', '192.168.1.107', '2025-11-19 01:05:32'),
('9d9951e6-d958-4945-8d27-c56a6b4ab8e1', '5f94109d-7d2c-461a-991d-c233313ce128', '8849d2e3-c292-4439-9694-f11de9f16693', '2024-09-09 00:00:00', '192.168.1.105', '2025-11-19 01:05:32'),
('afcca7dc-efd2-47d9-b5b8-de3a6bcd1e7b', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', '2024-05-09 00:00:00', '192.168.1.103', '2025-11-19 01:05:32'),
('c70f361f-bbd9-4435-a480-537aafa605f0', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'd0e2eaf6-413d-46cc-b21e-24d3eb26705d', '2024-10-09 00:00:00', '192.168.1.109', '2025-11-19 01:05:32'),
('c843e165-a35a-4647-a2a5-9a64f43b885b', '5f94109d-7d2c-461a-991d-c233313ce128', 'b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', '2024-07-09 00:00:00', '192.168.1.105', '2025-11-19 01:05:32'),
('d641b1f2-7c63-4f9c-8595-1a7b15857e1d', '38f43b2b-440d-4f4c-9016-a80cd074e167', '8849d2e3-c292-4439-9694-f11de9f16693', '2024-01-09 00:00:00', '192.168.1.109', '2025-11-19 01:05:32'),
('d8258519-2eca-4be1-ade1-7c5fac1c7a40', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '8849d2e3-c292-4439-9694-f11de9f16693', '2024-04-09 00:00:00', '192.168.1.100', '2025-11-19 01:05:32'),
('e19eda59-eaca-489a-adaa-85c2c59b4e02', '1f9112ef-6dbd-493a-b6ae-47526a04220e', '38e35135-69ce-46a5-b528-25935f1ece3a', '2024-11-09 00:00:00', '192.168.1.108', '2025-11-19 01:05:32'),
('e4a56305-cb5a-454a-bb32-8bb469841474', '38f43b2b-440d-4f4c-9016-a80cd074e167', '38e35135-69ce-46a5-b528-25935f1ece3a', '2024-12-09 00:00:00', '192.168.1.109', '2025-11-19 01:05:32'),
('ed2d826e-18cf-4cb4-bbde-0daba7b2de4c', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', '38e35135-69ce-46a5-b528-25935f1ece3a', '2024-05-09 00:00:00', '192.168.1.102', '2025-11-19 01:05:32'),
('fad63230-81e5-4eff-9177-215a9da2f779', '3f808a8a-d28b-4170-b749-1c3e5538e952', '38e35135-69ce-46a5-b528-25935f1ece3a', '2024-06-09 00:00:00', '192.168.1.103', '2025-11-19 01:05:32'),
('fd84caaf-1b4c-4078-88e1-7f0171ed9964', '14da6ba5-e41c-4825-a468-e55144d233f6', '8849d2e3-c292-4439-9694-f11de9f16693', '2024-11-09 00:00:00', '192.168.1.107', '2025-11-19 01:05:32');

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
('09b63ac5-188e-4756-ac42-822911cb8e62', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'e21f25b9-de2b-4317-bf4b-1694475b78ba', '2025-11-19 01:05:32'),
('1117d294-65c8-4de2-af10-6e725e0e49c4', 'f4015be8-9d2a-4441-a532-4c58b6b682be', '8b3896a3-d99e-407c-a753-a07dea71d18f', '2025-11-19 01:05:32'),
('254c09a5-b992-4bbe-b548-8baa3b7cbb51', '1f9112ef-6dbd-493a-b6ae-47526a04220e', '8b3896a3-d99e-407c-a753-a07dea71d18f', '2025-11-19 01:05:32'),
('35a861cf-d51d-456b-bbb6-f0e4850b9d3f', '5f94109d-7d2c-461a-991d-c233313ce128', '8b3896a3-d99e-407c-a753-a07dea71d18f', '2025-11-19 01:05:32'),
('39374644-ffec-40f7-b3e6-f381fe319cee', '14da6ba5-e41c-4825-a468-e55144d233f6', '8b3896a3-d99e-407c-a753-a07dea71d18f', '2025-11-19 01:05:32'),
('a3bc4967-58c8-4b15-85ef-9a0ca1132458', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'f8793dc8-a5f7-4b04-843d-919a32ab6dbd', '2025-11-19 01:05:32'),
('dad65adb-b90e-49e5-9734-ec9002bbf2fe', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '793bf543-4736-4ad0-81e1-76a52164b8d6', '2025-11-19 01:05:32'),
('e23c681b-871d-4ebe-88d0-65fb77bd049b', '38f43b2b-440d-4f4c-9016-a80cd074e167', '8b3896a3-d99e-407c-a753-a07dea71d18f', '2025-11-19 01:05:32'),
('e5297148-2f26-4c8f-b271-a20d59f1bda2', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'e21f25b9-de2b-4317-bf4b-1694475b78ba', '2025-11-19 01:05:32'),
('fa6a3f9d-5525-4de8-b998-bf168e6c42c8', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', '71203b82-7db0-4b32-a524-6358d03e4211', '2025-11-19 01:05:32');

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
  `notes` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_training_records`
--

INSERT INTO `employee_training_records` (`id`, `employeeId`, `trainingId`, `assignedDate`, `completedDate`, `dueDate`, `status`, `score`, `notes`, `createdAt`, `updatedAt`) VALUES
('055245d4-89ad-46c2-b7b3-40b5a6626882', '1f9112ef-6dbd-493a-b6ae-47526a04220e', '570dc884-9f3e-4594-a4fb-4a55f8fef134', '2024-09-30 00:00:00', '2024-11-05 00:00:00', '2024-12-31 00:00:00', 'completed', 94, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('091d7fae-65d7-4798-a66d-3bf8e7f386bf', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'ba31fd19-2665-419b-a095-676613510a2a', '2024-06-30 00:00:00', '2024-08-05 00:00:00', '2024-09-30 00:00:00', 'completed', 91, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('0ce1e8ce-7e8f-45a9-ae41-068d7902b6d1', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '570dc884-9f3e-4594-a4fb-4a55f8fef134', '2024-01-31 00:00:00', '2024-03-05 00:00:00', '2024-04-30 00:00:00', 'completed', 86, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('130909a6-8d80-4092-894c-79a968106389', '1f9112ef-6dbd-493a-b6ae-47526a04220e', '9c1e6ce1-4a72-4771-a6da-aaef545cc136', '2023-12-31 00:00:00', NULL, '2024-03-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('1c15453a-1e1c-4bc5-9981-11461eda4c2b', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'aaa3194d-697a-46f7-8876-86cdb06a2f3d', '2024-09-30 00:00:00', '2024-11-05 00:00:00', '2024-12-31 00:00:00', 'completed', 94, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('1cf3926d-e74a-4db6-b10f-da7e3293c027', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'be96ea1c-72d4-4120-9d3c-cf6f13319c7f', '2024-04-30 00:00:00', NULL, '2024-07-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('1d56db4f-c127-4a2c-947c-123c429524be', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'be96ea1c-72d4-4120-9d3c-cf6f13319c7f', '2024-07-31 00:00:00', NULL, '2024-10-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('1e10b37f-be9d-4aa2-82fd-55e01279c155', '14da6ba5-e41c-4825-a468-e55144d233f6', 'aaa3194d-697a-46f7-8876-86cdb06a2f3d', '2024-07-31 00:00:00', '2024-09-05 00:00:00', '2024-10-31 00:00:00', 'completed', 92, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('217802fa-03ca-4f94-a457-5608695f30a2', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'ba31fd19-2665-419b-a095-676613510a2a', '2024-02-29 00:00:00', '2024-04-05 00:00:00', '2024-05-31 00:00:00', 'completed', 87, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('27d05a05-acd4-437c-b809-4fb5f24f99ba', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '9c1e6ce1-4a72-4771-a6da-aaef545cc136', '2024-04-30 00:00:00', NULL, '2024-07-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('306d441d-55d7-42cb-a7f8-b2bd4b58db38', '38f43b2b-440d-4f4c-9016-a80cd074e167', '570dc884-9f3e-4594-a4fb-4a55f8fef134', '2024-10-31 00:00:00', '2024-12-05 00:00:00', '2025-01-31 00:00:00', 'completed', 95, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('31fcff22-95bf-4325-9c80-e2d01e84c75c', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'ba31fd19-2665-419b-a095-676613510a2a', '2024-05-31 00:00:00', '2024-07-05 00:00:00', '2024-08-31 00:00:00', 'completed', 90, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('4b12bec7-ad19-4417-958e-591f71ea825d', '87efcad0-6e83-4541-bff2-4c54cda978e3', '570dc884-9f3e-4594-a4fb-4a55f8fef134', '2024-02-29 00:00:00', '2024-04-05 00:00:00', '2024-05-31 00:00:00', 'completed', 87, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('4cf22907-fb56-4402-86ea-9d083d8b1c07', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'aaa3194d-697a-46f7-8876-86cdb06a2f3d', '2024-02-29 00:00:00', '2024-04-05 00:00:00', '2024-05-31 00:00:00', 'completed', 87, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('4d94d1d9-ae2b-4593-9490-800b641ceb67', '38f43b2b-440d-4f4c-9016-a80cd074e167', '9c1e6ce1-4a72-4771-a6da-aaef545cc136', '2024-01-31 00:00:00', NULL, '2024-04-30 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('50e9c676-f3dc-4dec-bcfc-cc7ed36df52e', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'ba31fd19-2665-419b-a095-676613510a2a', '2024-04-30 00:00:00', '2024-06-05 00:00:00', '2024-07-31 00:00:00', 'completed', 89, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('574784b2-4928-4e2b-bbe7-dc8b099183c9', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'aaa3194d-697a-46f7-8876-86cdb06a2f3d', '2024-08-31 00:00:00', '2024-10-05 00:00:00', '2024-11-30 00:00:00', 'completed', 93, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('5a6ce6b9-b1aa-4e38-bb25-f6d7f3a186bf', '5f94109d-7d2c-461a-991d-c233313ce128', 'be96ea1c-72d4-4120-9d3c-cf6f13319c7f', '2024-08-31 00:00:00', NULL, '2024-11-30 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('60c70165-d4b0-4833-a4f7-b6e646bc8ceb', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'aaa3194d-697a-46f7-8876-86cdb06a2f3d', '2024-03-31 00:00:00', '2024-05-05 00:00:00', '2024-06-30 00:00:00', 'completed', 88, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('6100228a-a05a-4ef0-a0b6-dc80027a9938', '3f808a8a-d28b-4170-b749-1c3e5538e952', '570dc884-9f3e-4594-a4fb-4a55f8fef134', '2024-04-30 00:00:00', '2024-06-05 00:00:00', '2024-07-31 00:00:00', 'completed', 89, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('66a657b7-5df3-459d-b8b4-70c6b381491a', '5f94109d-7d2c-461a-991d-c233313ce128', 'ba31fd19-2665-419b-a095-676613510a2a', '2024-07-31 00:00:00', '2024-09-05 00:00:00', '2024-10-31 00:00:00', 'completed', 92, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('679fefca-181f-497c-844a-524c927920a8', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'aaa3194d-697a-46f7-8876-86cdb06a2f3d', '2024-01-31 00:00:00', '2024-03-05 00:00:00', '2024-04-30 00:00:00', 'completed', 86, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('6e47c0bd-2e2b-4e03-bead-b11589337c78', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'be96ea1c-72d4-4120-9d3c-cf6f13319c7f', '2024-05-31 00:00:00', NULL, '2024-08-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('72bb3575-d88e-4c4f-87dc-5c9072f736b6', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'be96ea1c-72d4-4120-9d3c-cf6f13319c7f', '2023-12-31 00:00:00', NULL, '2024-03-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('77c67a05-74b9-4e2b-a900-3a65c606b852', '3f808a8a-d28b-4170-b749-1c3e5538e952', '9c1e6ce1-4a72-4771-a6da-aaef545cc136', '2024-07-31 00:00:00', NULL, '2024-10-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('7cfc1e1f-c702-4098-9f71-f4702e141dad', 'f4015be8-9d2a-4441-a532-4c58b6b682be', '9c1e6ce1-4a72-4771-a6da-aaef545cc136', '2024-08-31 00:00:00', NULL, '2024-11-30 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('7ec001e0-8f59-4774-a663-090abc93f4ef', '71c6818d-8c95-468a-979c-62ff555ad2c7', '9c1e6ce1-4a72-4771-a6da-aaef545cc136', '2024-10-31 00:00:00', NULL, '2025-01-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('822b56bb-32f0-4aa2-9a3b-4737a79f8c85', '5f94109d-7d2c-461a-991d-c233313ce128', '9c1e6ce1-4a72-4771-a6da-aaef545cc136', '2024-09-30 00:00:00', NULL, '2024-12-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('84c4dfc6-343f-4c4d-a74f-5eed784dc066', '87efcad0-6e83-4541-bff2-4c54cda978e3', '9c1e6ce1-4a72-4771-a6da-aaef545cc136', '2024-05-31 00:00:00', NULL, '2024-08-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('9337633e-9fcd-4a7c-9cdb-3c25e649eeb9', '5f94109d-7d2c-461a-991d-c233313ce128', 'aaa3194d-697a-46f7-8876-86cdb06a2f3d', '2024-05-31 00:00:00', '2024-07-05 00:00:00', '2024-08-31 00:00:00', 'completed', 90, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('9719e585-e016-4340-aecd-f3feedc193bd', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'be96ea1c-72d4-4120-9d3c-cf6f13319c7f', '2024-06-30 00:00:00', NULL, '2024-09-30 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('9bc81234-8f22-44e4-a09e-b0fb26c2636d', '14da6ba5-e41c-4825-a468-e55144d233f6', 'be96ea1c-72d4-4120-9d3c-cf6f13319c7f', '2024-10-31 00:00:00', NULL, '2025-01-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a1bae2ce-804f-4fce-893c-98caf5e3f32d', '71c6818d-8c95-468a-979c-62ff555ad2c7', '570dc884-9f3e-4594-a4fb-4a55f8fef134', '2024-07-31 00:00:00', '2024-09-05 00:00:00', '2024-10-31 00:00:00', 'completed', 92, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a29f2f2b-f5bf-43ad-8648-3d92efa268b1', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'be96ea1c-72d4-4120-9d3c-cf6f13319c7f', '2024-03-31 00:00:00', NULL, '2024-06-30 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a9705256-082d-41a8-8b93-1b8dd5358c52', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'ba31fd19-2665-419b-a095-676613510a2a', '2024-11-30 00:00:00', '2025-01-05 00:00:00', '2025-02-28 00:00:00', 'completed', 96, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('b1d7d34b-90bd-4a6c-abc5-c2d69df782af', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'ba31fd19-2665-419b-a095-676613510a2a', '2024-03-31 00:00:00', '2024-05-05 00:00:00', '2024-06-30 00:00:00', 'completed', 88, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('bc87fd15-0822-4745-b5de-970a189f9f2a', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'aaa3194d-697a-46f7-8876-86cdb06a2f3d', '2024-04-30 00:00:00', '2024-06-05 00:00:00', '2024-07-31 00:00:00', 'completed', 89, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('c3e51652-0b10-4c33-8410-85b2e2af05fb', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'ba31fd19-2665-419b-a095-676613510a2a', '2024-08-31 00:00:00', '2024-10-05 00:00:00', '2024-11-30 00:00:00', 'completed', 93, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('cab698a9-62f4-4cbe-ba2f-d6d36f104280', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'be96ea1c-72d4-4120-9d3c-cf6f13319c7f', '2024-11-30 00:00:00', NULL, '2025-02-28 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('cb815ab7-c13c-45cc-aa8f-610d66883366', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'ba31fd19-2665-419b-a095-676613510a2a', '2024-10-31 00:00:00', '2024-12-05 00:00:00', '2025-01-31 00:00:00', 'completed', 95, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('cd9e995c-d63f-4ed9-b618-9a0e4e955068', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', '570dc884-9f3e-4594-a4fb-4a55f8fef134', '2024-03-31 00:00:00', '2024-05-05 00:00:00', '2024-06-30 00:00:00', 'completed', 88, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('cf2d4490-9897-4dd5-bea7-505f5db98658', '14da6ba5-e41c-4825-a468-e55144d233f6', '570dc884-9f3e-4594-a4fb-4a55f8fef134', '2024-08-31 00:00:00', '2024-10-05 00:00:00', '2024-11-30 00:00:00', 'completed', 93, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d0599a9b-6cca-4d89-9ff5-a9755f40681e', '14da6ba5-e41c-4825-a468-e55144d233f6', 'ba31fd19-2665-419b-a095-676613510a2a', '2024-09-30 00:00:00', '2024-11-05 00:00:00', '2024-12-31 00:00:00', 'completed', 94, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d48f537c-f936-4089-914e-c13776b16352', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', '9c1e6ce1-4a72-4771-a6da-aaef545cc136', '2024-06-30 00:00:00', NULL, '2024-09-30 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ddedc74f-0715-4e17-8a65-c3a495d9890f', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'aaa3194d-697a-46f7-8876-86cdb06a2f3d', '2024-06-30 00:00:00', '2024-08-05 00:00:00', '2024-09-30 00:00:00', 'completed', 91, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('e70b2dc8-1fbe-4ff1-b24d-eba933b2ba52', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'be96ea1c-72d4-4120-9d3c-cf6f13319c7f', '2024-09-30 00:00:00', NULL, '2024-12-31 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ec78edec-774c-4ea8-8440-6154e17e4e09', '5f94109d-7d2c-461a-991d-c233313ce128', '570dc884-9f3e-4594-a4fb-4a55f8fef134', '2024-06-30 00:00:00', '2024-08-05 00:00:00', '2024-09-30 00:00:00', 'completed', 91, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ee76f83b-f985-42b7-b3ee-eb6e7377a71e', '14da6ba5-e41c-4825-a468-e55144d233f6', '9c1e6ce1-4a72-4771-a6da-aaef545cc136', '2024-11-30 00:00:00', NULL, '2025-02-28 00:00:00', 'overdue', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ef43c4f4-b872-4788-82bb-6663537fccd7', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'aaa3194d-697a-46f7-8876-86cdb06a2f3d', '2023-12-31 00:00:00', '2024-02-05 00:00:00', '2024-03-31 00:00:00', 'completed', 85, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('efc2f212-b9ea-4b68-a5e9-5d4386acb1f9', 'f4015be8-9d2a-4441-a532-4c58b6b682be', '570dc884-9f3e-4594-a4fb-4a55f8fef134', '2024-05-31 00:00:00', '2024-07-05 00:00:00', '2024-08-31 00:00:00', 'completed', 90, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
('176776ac-bb02-4403-a08e-16213908e85c', 'HIPAA', 'Incident 1: HIPAA Issue', 'Description of hipaa incident that occurred.', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'low', 'open', '2025-11-14 00:00:00', '2025-11-15 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('4c8debf2-f432-46a1-91ab-7d68d224d458', 'Safety', 'Incident 8: Safety Issue', 'Description of safety incident that occurred.', '38f43b2b-440d-4f4c-9016-a80cd074e167', '14da6ba5-e41c-4825-a468-e55144d233f6', 'medium', 'in_progress', '2025-10-21 00:00:00', '2025-10-22 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('62d8bc25-bdf4-4c96-8c80-e7cd2b27e213', 'Medication Error', 'Incident 6: Medication Error Issue', 'Description of medication error incident that occurred.', '14da6ba5-e41c-4825-a468-e55144d233f6', '5f94109d-7d2c-461a-991d-c233313ce128', 'high', 'closed', '2025-09-19 00:00:00', '2025-09-20 00:00:00', '2025-09-25 00:00:00', 'Issue resolved with corrective action implemented.', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('b4b76805-b6f3-4a75-952c-63980e2fb797', 'Safety', 'Incident 2: Safety Issue', 'Description of safety incident that occurred.', '3f808a8a-d28b-4170-b749-1c3e5538e952', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'medium', 'in_progress', '2025-10-15 00:00:00', '2025-10-16 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('c727bf0d-29e7-43a4-8c7b-6be032573a45', 'Medication Error', 'Incident 3: Medication Error Issue', 'Description of medication error incident that occurred.', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'high', 'closed', '2025-09-16 00:00:00', '2025-09-17 00:00:00', '2025-09-22 00:00:00', 'Issue resolved with corrective action implemented.', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d8da03ec-88dd-48e9-9a37-593bd86172c1', 'HIPAA', 'Incident 7: HIPAA Issue', 'Description of hipaa incident that occurred.', '1f9112ef-6dbd-493a-b6ae-47526a04220e', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'low', 'open', '2025-11-20 00:00:00', '2025-11-21 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f18aae78-d060-46ab-b788-54c991b47b6d', 'Safety', 'Incident 5: Safety Issue', 'Description of safety incident that occurred.', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'medium', 'in_progress', '2025-10-18 00:00:00', '2025-10-19 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('fce17e0e-05eb-46d2-98b7-16303f1acd51', 'HIPAA', 'Incident 4: HIPAA Issue', 'Description of hipaa incident that occurred.', '5f94109d-7d2c-461a-991d-c233313ce128', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'low', 'open', '2025-11-17 00:00:00', '2025-11-18 00:00:00', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
  `reason` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `approvedBy` varchar(36) DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_requests`
--

INSERT INTO `leave_requests` (`id`, `employeeId`, `type`, `startDate`, `endDate`, `reason`, `status`, `approvedBy`, `approvedAt`, `rejectionReason`, `createdAt`, `updatedAt`) VALUES
('22023309-7978-434d-938e-5c1bd07405d3', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'Sick Leave', '2025-02-14', '2025-02-16', 'Leave request for personal reasons', 'approved', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '2025-02-09 00:00:00', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('335d6a18-fe7c-4978-aa4e-763d9371a938', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'PTO', '2025-04-14', '2025-04-18', 'Leave request for personal reasons', 'pending', NULL, NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('4112e373-2f19-4037-97f6-c1d9983fda58', '14da6ba5-e41c-4825-a468-e55144d233f6', 'Sick Leave', '2025-08-14', '2025-08-17', 'Leave request for personal reasons', 'approved', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '2025-08-09 00:00:00', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('5847fc35-8f8b-45a4-a1f9-3cbc95047916', '5f94109d-7d2c-461a-991d-c233313ce128', 'Unpaid Leave', '2025-06-14', '2025-06-15', 'Leave request for personal reasons', 'rejected', NULL, NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('805f91a9-dce7-483e-8abd-13eec012c0f4', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'Unpaid Leave', '2025-03-14', '2025-03-17', 'Leave request for personal reasons', 'rejected', NULL, NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('87e03a13-44ef-4086-bb0f-479e5dab0e20', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'PTO', '2025-10-14', '2025-10-19', 'Leave request for personal reasons', 'pending', NULL, NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('890ee6b5-b18b-41b9-87f4-0ed8933533ed', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'PTO', '2025-01-14', '2025-01-15', 'Leave request for personal reasons', 'pending', NULL, NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('b75c4ac8-dcb3-4bfc-9599-2482b726f40d', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'Sick Leave', '2025-05-14', '2025-05-19', 'Leave request for personal reasons', 'approved', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '2025-05-09 00:00:00', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d18dce0d-24dd-4066-8550-21867141a888', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'PTO', '2025-07-14', '2025-07-16', 'Leave request for personal reasons', 'pending', NULL, NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ee5e1c68-a547-4940-a04b-ac04af28390e', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'Unpaid Leave', '2025-09-14', '2025-09-18', 'Leave request for personal reasons', 'rejected', NULL, NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
('0de3ae89-12c8-4e55-81f4-00ad6d4a03f0', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'Compounding Certificate', 'LIC-FL-1008', 'FL', '2023-09-14', '2026-09-14', NULL, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('10ed7ba5-1be4-4d87-b17c-5b1d5a667fc0', '5f94109d-7d2c-461a-991d-c233313ce128', 'Compounding Certificate', 'LIC-CA-1005', 'CA', '2023-06-14', '2026-06-14', NULL, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('2a77a777-1a27-4129-a804-8c1aed710dd5', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'Compounding Certificate', 'LIC-TX-1002', 'TX', '2023-03-14', '2026-03-14', NULL, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('304c0d39-88b5-4247-9849-217617e62b7c', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'Pharmacist', 'LIC-IL-1009', 'IL', '2023-10-14', '2026-10-14', NULL, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('469f8625-bd0e-4f7a-b52a-f7dc3a9428db', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'Pharmacy Technician', 'LIC-NY-1001', 'NY', '2023-02-14', '2026-02-14', NULL, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('52ac7010-b761-4e08-b260-a12022fc2c23', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'Pharmacist', 'LIC-CA-1000', 'CA', '2023-01-14', '2026-01-14', NULL, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ab801f68-45ac-4247-998f-77782a2d50e2', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'Pharmacy Technician', 'LIC-IL-1004', 'IL', '2023-05-14', '2026-05-14', NULL, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('bf4cd10f-86a3-49ff-8ef3-5069ada0ff8e', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'Pharmacist', 'LIC-NY-1006', 'NY', '2023-07-14', '2026-07-14', NULL, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('c4a42141-26b4-4a50-9ebd-5f55015b1410', '14da6ba5-e41c-4825-a468-e55144d233f6', 'Pharmacy Technician', 'LIC-TX-1007', 'TX', '2023-08-14', '2026-08-14', NULL, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('db6498af-d8b3-4c84-995f-233a9e3677d4', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'Pharmacist', 'LIC-FL-1003', 'FL', '2023-04-14', '2026-04-14', NULL, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
('0c9459a0-9733-4d3c-8b47-04d9b282f837', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'incident_review', 'Incident Requires Review', 'An incident requires your review', 1, '2025-11-18 00:00:00', '/dashboard', '{\"priority\":\"high\"}', '2025-11-19 01:05:32'),
('111bb64b-fb2e-4b9e-93f3-47100ee78bec', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'incident_review', 'Incident Requires Review', 'An incident requires your review', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('1ec0d93b-1527-48af-b572-79be8879b3f7', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'leave_approval', 'Leave Request Approved', 'Your leave request has been approved', 1, '2025-11-18 00:00:00', '/dashboard', '{\"priority\":\"high\"}', '2025-11-19 01:05:32'),
('3151991a-4e9c-4502-9d62-01ddcb56e31e', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'incident_review', 'Incident Requires Review', 'An incident requires your review', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('31bbb665-69dc-4659-922f-5812d19dba6d', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'license_expiry', 'License Expiring Soon', 'Your license will expire in 30 days', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:33'),
('34214cb3-1253-43a1-8cbc-9fa26ec5a690', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'onboarding_task', 'Onboarding Task Pending', 'You have pending onboarding tasks', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('3b3de53f-953b-49d0-8349-631541196804', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'incident_review', 'Incident Requires Review', 'An incident requires your review', 1, '2025-11-18 00:00:00', '/dashboard', '{\"priority\":\"high\"}', '2025-11-19 01:05:33'),
('43a38cc7-7864-49b4-b363-37c9212063a1', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'leave_approval', 'Leave Request Approved', 'Your leave request has been approved', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('4497426d-578c-4ca4-bf92-8fcc56d8863a', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'incident_review', 'Incident Requires Review', 'An incident requires your review', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('4b177d4f-3eb1-4ccf-8bc0-768e5b6894d6', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'license_expiry', 'License Expiring Soon', 'Your license will expire in 30 days', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('52d8699c-ffea-4ad3-b725-c9d0cf9d17a2', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'training_due', 'Training Due', 'You have a training module due soon', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:33'),
('5eea3edf-4a3d-4099-a90f-959852735c6c', '14da6ba5-e41c-4825-a468-e55144d233f6', 'leave_approval', 'Leave Request Approved', 'Your leave request has been approved', 1, '2025-11-18 00:00:00', '/dashboard', '{\"priority\":\"high\"}', '2025-11-19 01:05:32'),
('63d60bb8-69cb-4805-b4ee-2a8599fe07c2', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'leave_approval', 'Leave Request Approved', 'Your leave request has been approved', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('6604698d-d9c7-4e7c-8efc-7d39230e484d', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'onboarding_task', 'Onboarding Task Pending', 'You have pending onboarding tasks', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:33'),
('6cc61276-856d-4b0b-b4d9-16c9c09b9f43', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'training_due', 'Training Due', 'You have a training module due soon', 1, '2025-11-19 01:34:46', '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('7b2c6343-4aeb-4cc0-afa9-6a6384d9f5f4', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'onboarding_task', 'Onboarding Task Pending', 'You have pending onboarding tasks', 1, '2025-11-18 00:00:00', '/dashboard', '{\"priority\":\"high\"}', '2025-11-19 01:05:32'),
('8f46e45b-30bd-4cba-989c-b1b22c7a34c8', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'license_expiry', 'License Expiring Soon', 'Your license will expire in 30 days', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('92bd1dfc-32b8-4c73-af84-06d7f90f15e5', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'license_expiry', 'License Expiring Soon', 'Your license will expire in 30 days', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:33'),
('ad89e55c-0e2d-4d2f-b8ff-bbc65adfdfb5', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'license_expiry', 'License Expiring Soon', 'Your license will expire in 30 days', 1, '2025-11-18 00:00:00', '/dashboard', '{\"priority\":\"high\"}', '2025-11-19 01:05:32'),
('afddd051-050d-4aad-9c76-2fe76543aaa0', '14da6ba5-e41c-4825-a468-e55144d233f6', 'incident_review', 'Incident Requires Review', 'An incident requires your review', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:33'),
('b36fad51-ef00-4c31-99b5-caf378565d03', '5f94109d-7d2c-461a-991d-c233313ce128', 'training_due', 'Training Due', 'You have a training module due soon', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('b820e916-9599-43a4-89ba-4f3151c44b3b', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'onboarding_task', 'Onboarding Task Pending', 'You have pending onboarding tasks', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('b9f9d607-66fc-48ea-91f1-46fd6620527c', '5f94109d-7d2c-461a-991d-c233313ce128', 'leave_approval', 'Leave Request Approved', 'Your leave request has been approved', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('ba71d5d4-ed5b-4e1c-a7da-fa30b5554215', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'training_due', 'Training Due', 'You have a training module due soon', 1, '2025-11-18 00:00:00', '/dashboard', '{\"priority\":\"high\"}', '2025-11-19 01:05:32'),
('c121b5db-97ac-4c3a-a2b1-2bba79c7d460', '14da6ba5-e41c-4825-a468-e55144d233f6', 'onboarding_task', 'Onboarding Task Pending', 'You have pending onboarding tasks', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:33'),
('c26cc57a-e1bf-4a70-8f4f-2d0627860231', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'training_due', 'Training Due', 'You have a training module due soon', 1, '2025-11-18 00:00:00', '/dashboard', '{\"priority\":\"high\"}', '2025-11-19 01:05:32'),
('d58e9635-37c6-4498-8d5a-248882f95346', '5f94109d-7d2c-461a-991d-c233313ce128', 'license_expiry', 'License Expiring Soon', 'Your license will expire in 30 days', 1, '2025-11-18 00:00:00', '/dashboard', '{\"priority\":\"high\"}', '2025-11-19 01:05:32'),
('dfc8ebc3-7bdb-4887-a827-d0982ae97ab4', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'leave_approval', 'Leave Request Approved', 'Your leave request has been approved', 1, '2025-11-19 01:34:51', '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32'),
('edf198b1-1f5f-482d-b2e9-35061bdcc561', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'onboarding_task', 'Onboarding Task Pending', 'You have pending onboarding tasks', 1, '2025-11-18 00:00:00', '/dashboard', '{\"priority\":\"high\"}', '2025-11-19 01:05:33'),
('fddbd553-aed4-4555-97ea-6bb8a6a659eb', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'training_due', 'Training Due', 'You have a training module due soon', 0, NULL, '/dashboard', '{\"priority\":\"normal\"}', '2025-11-19 01:05:32');

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

--
-- Dumping data for table `performance_evaluations`
--

INSERT INTO `performance_evaluations` (`id`, `employeeId`, `period`, `evaluatorId`, `ratings`, `goals`, `notes`, `documentUrl`, `createdAt`, `updatedAt`) VALUES
('37cba1b4-eab0-4a95-a1d0-8c09240b8ce1', 'f50c3257-7329-4cbb-b21c-beddc84a3455', 'Q1 2024', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '{\"communication\":4,\"teamwork\":4,\"technical_skills\":4,\"compliance\":5,\"overall\":4.2}', '[\"Improve compounding accuracy\",\"Complete additional training modules\",\"Enhance patient communication\"]', 'Performance evaluation for Q1 2024. Employee shows strong commitment to compliance and safety.', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('65848154-3231-45c7-a6fa-c02022722acf', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'Q4 2023', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '{\"communication\":4,\"teamwork\":4,\"technical_skills\":4,\"compliance\":5,\"overall\":4.2}', '[\"Improve compounding accuracy\",\"Complete additional training modules\",\"Enhance patient communication\"]', 'Performance evaluation for Q4 2023. Employee shows strong commitment to compliance and safety.', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('692a66fa-777a-4b7d-85fd-86104f932c97', '87efcad0-6e83-4541-bff2-4c54cda978e3', 'Q2 2024', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '{\"communication\":5,\"teamwork\":5,\"technical_skills\":5,\"compliance\":5,\"overall\":4.5}', '[\"Improve compounding accuracy\",\"Complete additional training modules\",\"Enhance patient communication\"]', 'Performance evaluation for Q2 2024. Employee shows strong commitment to compliance and safety.', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('8b02d7f0-1671-45ae-ae25-0e7674cd1279', '14da6ba5-e41c-4825-a468-e55144d233f6', 'Q3 2024', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '{\"communication\":5,\"teamwork\":5,\"technical_skills\":5,\"compliance\":5,\"overall\":4.5}', '[\"Improve compounding accuracy\",\"Complete additional training modules\",\"Enhance patient communication\"]', 'Performance evaluation for Q3 2024. Employee shows strong commitment to compliance and safety.', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('9fa23b07-feeb-4c3c-9635-e3c38ac31bd8', 'd832e4dc-f590-4dc4-9dc0-235afc267ec2', 'Q3 2024', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '{\"communication\":4,\"teamwork\":4,\"technical_skills\":4,\"compliance\":5,\"overall\":4.2}', '[\"Improve compounding accuracy\",\"Complete additional training modules\",\"Enhance patient communication\"]', 'Performance evaluation for Q3 2024. Employee shows strong commitment to compliance and safety.', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('cb060e77-7b99-4b4b-a074-4e5462495fe6', '5f94109d-7d2c-461a-991d-c233313ce128', 'Q1 2024', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '{\"communication\":5,\"teamwork\":5,\"technical_skills\":5,\"compliance\":5,\"overall\":4.5}', '[\"Improve compounding accuracy\",\"Complete additional training modules\",\"Enhance patient communication\"]', 'Performance evaluation for Q1 2024. Employee shows strong commitment to compliance and safety.', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d430d4e4-c9c9-4ca4-a78d-745ecbc8d700', '38f43b2b-440d-4f4c-9016-a80cd074e167', 'Q4 2023', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '{\"communication\":5,\"teamwork\":5,\"technical_skills\":5,\"compliance\":5,\"overall\":4.5}', '[\"Improve compounding accuracy\",\"Complete additional training modules\",\"Enhance patient communication\"]', 'Performance evaluation for Q4 2023. Employee shows strong commitment to compliance and safety.', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d5b9cd99-8708-42b3-a5b4-347d51fa784c', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'Annual 2023', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '{\"communication\":5,\"teamwork\":5,\"technical_skills\":5,\"compliance\":5,\"overall\":4.5}', '[\"Improve compounding accuracy\",\"Complete additional training modules\",\"Enhance patient communication\"]', 'Performance evaluation for Annual 2023. Employee shows strong commitment to compliance and safety.', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('eab892b6-f4b4-448f-83f8-fe98d26a4fc8', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'Q2 2024', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '{\"communication\":4,\"teamwork\":4,\"technical_skills\":4,\"compliance\":5,\"overall\":4.2}', '[\"Improve compounding accuracy\",\"Complete additional training modules\",\"Enhance patient communication\"]', 'Performance evaluation for Q2 2024. Employee shows strong commitment to compliance and safety.', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ef229430-6f68-43c3-b1d5-1fb77f560484', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'Annual 2023', 'f50c3257-7329-4cbb-b21c-beddc84a3455', '{\"communication\":4,\"teamwork\":4,\"technical_skills\":4,\"compliance\":5,\"overall\":4.2}', '[\"Improve compounding accuracy\",\"Complete additional training modules\",\"Enhance patient communication\"]', 'Performance evaluation for Annual 2023. Employee shows strong commitment to compliance and safety.', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
('8849d2e3-c292-4439-9694-f11de9f16693', 'Employee Handbook', 'Comprehensive employee handbook and guidelines', 'HR', NULL, '2024.1', 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('b9936f44-43dd-4e8a-8f79-e85ab99d9b8a', 'Compounding SOP', 'Standard operating procedures for pharmaceutical compounding', 'SOP', NULL, '1.5', 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d0e2eaf6-413d-46cc-b21e-24d3eb26705d', 'HIPAA Privacy Policy', 'Patient privacy and HIPAA compliance policy', 'HIPAA', NULL, '2.1', 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
('71203b82-7db0-4b32-a524-6358d03e4211', 'Pharmacy Manager', 'Department management', '{\"employees\":[\"read\",\"update\"],\"licenses\":[\"read\"],\"training\":[\"read\",\"assign\"],\"scheduling\":[\"create\",\"read\",\"update\",\"delete\"],\"leave\":[\"read\",\"approve\",\"reject\"],\"onboarding\":[\"read\",\"update\"],\"evaluations\":[\"create\",\"read\",\"update\"],\"incidents\":[\"create\",\"read\",\"update\"]}', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('793bf543-4736-4ad0-81e1-76a52164b8d6', 'HR Admin', 'Full HR system access', '{\"employees\":[\"create\",\"read\",\"update\",\"delete\"],\"licenses\":[\"create\",\"read\",\"update\",\"delete\"],\"training\":[\"create\",\"read\",\"update\",\"delete\",\"assign\"],\"scheduling\":[\"create\",\"read\",\"update\",\"delete\"],\"leave\":[\"read\",\"approve\",\"reject\"],\"onboarding\":[\"create\",\"read\",\"update\",\"delete\"],\"evaluations\":[\"create\",\"read\",\"update\",\"delete\"],\"incidents\":[\"create\",\"read\",\"update\",\"delete\"]}', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('8b3896a3-d99e-407c-a753-a07dea71d18f', 'Employee', 'Self-service access', '{\"employees\":[\"read\"],\"licenses\":[\"read\"],\"training\":[\"read\"],\"scheduling\":[\"read\"],\"leave\":[\"create\",\"read\"],\"onboarding\":[\"read\"],\"evaluations\":[\"read\"],\"incidents\":[\"create\",\"read\"]}', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('e21f25b9-de2b-4317-bf4b-1694475b78ba', 'Department Manager', 'Department-level management', '{\"employees\":[\"read\"],\"licenses\":[\"read\"],\"training\":[\"read\",\"assign\"],\"scheduling\":[\"create\",\"read\",\"update\"],\"leave\":[\"read\",\"approve\",\"reject\"],\"onboarding\":[\"read\"],\"evaluations\":[\"create\",\"read\",\"update\"],\"incidents\":[\"create\",\"read\"]}', '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f8793dc8-a5f7-4b04-843d-919a32ab6dbd', 'Compliance Officer', 'Compliance and training management', '{\"employees\":[\"read\"],\"licenses\":[\"create\",\"read\",\"update\"],\"training\":[\"create\",\"read\",\"update\",\"delete\",\"assign\"],\"scheduling\":[\"read\"],\"leave\":[\"read\"],\"onboarding\":[\"read\",\"update\"],\"evaluations\":[\"read\"],\"incidents\":[\"create\",\"read\",\"update\"]}', '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
  `notes` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shifts`
--

INSERT INTO `shifts` (`id`, `date`, `startTime`, `endTime`, `departmentId`, `notes`, `createdAt`, `updatedAt`) VALUES
('0e24b3dd-615e-4b8f-85a3-188acdcebfc3', '2025-11-16', '2025-11-17 08:00:00', '2025-11-17 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('2d744327-863d-4a79-b173-00e4dc42f7ea', '2025-12-12', '2025-12-13 08:00:00', '2025-12-13 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('2f4f5271-1add-452e-bc15-4b20553ea96b', '2025-12-01', '2025-12-02 08:00:00', '2025-12-02 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('3dfcf1d9-f347-4f8d-9f16-3587e558ff8b', '2025-11-20', '2025-11-21 08:00:00', '2025-11-21 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('41ab61b5-0b8c-45ca-86de-a15ad4b22e4a', '2025-12-09', '2025-12-10 08:00:00', '2025-12-10 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('45491744-f0c0-435f-9e6c-4af4666ae398', '2025-11-28', '2025-11-29 08:00:00', '2025-11-29 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('4e1b0bef-d251-4c86-8a0d-d621fd4e35ac', '2025-12-06', '2025-12-07 08:00:00', '2025-12-07 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('598321de-2c77-4a62-9a56-f3f70600eb48', '2025-12-08', '2025-12-09 08:00:00', '2025-12-09 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('63ffea0e-4be8-44d9-8d13-88f90ac2d81d', '2025-11-19', '2025-11-19 09:00:00', '2025-11-19 17:00:00', 'pharmacy', NULL, '2025-11-19 01:17:39', '2025-11-19 01:17:39'),
('718d6aec-7876-4e36-ba98-a386712e2c32', '2025-12-07', '2025-12-08 08:00:00', '2025-12-08 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('788d19f6-b601-4b10-a820-d3384b62c16e', '2025-11-23', '2025-11-24 08:00:00', '2025-11-24 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('7b40a86d-c434-4131-9f04-23df5349ea3c', '2025-11-17', '2025-11-18 08:00:00', '2025-11-18 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('8daf4005-4c6d-4131-910a-046cb4476e55', '2025-11-22', '2025-11-23 08:00:00', '2025-11-23 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a2afd5bb-0583-4259-94d5-811249127187', '2025-11-19', '2025-11-20 08:00:00', '2025-11-20 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a7236b2a-91c7-4122-937f-7a70fcbcb66c', '2025-12-02', '2025-12-03 08:00:00', '2025-12-03 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a881c582-ff3c-43c1-98c3-6c90157c5360', '2025-12-05', '2025-12-06 08:00:00', '2025-12-06 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ae37bb0a-db03-4ccc-b37d-89a233cdfabe', '2025-11-25', '2025-11-26 08:00:00', '2025-11-26 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('aeadb611-b031-49b4-b123-0fdd74e349b4', '2025-11-27', '2025-11-28 08:00:00', '2025-11-28 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('c1748871-7302-468a-a15b-f91f6dfb3a59', '2025-11-29', '2025-11-30 08:00:00', '2025-11-30 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('c4e4038e-e93a-48f0-ad81-4afa7524fe49', '2025-12-11', '2025-12-12 08:00:00', '2025-12-12 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('c7b0ed9e-109d-4c51-9ea1-bfb133f7c92f', '2025-11-24', '2025-11-25 08:00:00', '2025-11-25 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ccb95402-2031-4d27-a17d-435fc425e6b8', '2025-12-10', '2025-12-11 08:00:00', '2025-12-11 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ce9c18a5-921a-4c81-8ba9-2be577aff42e', '2025-11-26', '2025-11-27 08:00:00', '2025-11-27 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('d0e47cd1-4a5d-46bf-a37a-5e2725597ffc', '2025-12-04', '2025-12-05 08:00:00', '2025-12-05 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('dbfccea4-4d86-46df-b172-dd38cdec95a3', '2025-11-21', '2025-11-22 08:00:00', '2025-11-22 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('e780ed1b-498a-4dc8-bf8c-059aaa1d051e', '2025-11-18', '2025-11-19 08:00:00', '2025-11-19 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f7419006-f972-4b0b-b4fe-edfa6a08273c', '2025-12-03', '2025-12-04 08:00:00', '2025-12-04 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f7b770b4-4e7b-4cc0-8786-c0af7eae0c73', '2025-11-30', '2025-12-01 08:00:00', '2025-12-01 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('facbfe59-6bf2-4783-84ed-949ed2ffc26e', '2025-11-15', '2025-11-16 08:00:00', '2025-11-16 17:00:00', '217552b1-00f0-4a91-8f12-4e6329915199', NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

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
('00bbcf76-8d7a-4b58-a010-bb098474fb54', '41ab61b5-0b8c-45ca-86de-a15ad4b22e4a', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('28c0b902-ee5b-48a1-94f5-a88bc39f31ba', '2f4f5271-1add-452e-bc15-4b20553ea96b', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('43118c09-3aed-4abe-a9c0-c0936aeb9822', 'c7b0ed9e-109d-4c51-9ea1-bfb133f7c92f', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('4bac1cf7-823a-4c1f-8179-adbda058765a', 'd0e47cd1-4a5d-46bf-a37a-5e2725597ffc', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('567f4d63-2b82-4d16-9b9b-0911ab96784a', '0e24b3dd-615e-4b8f-85a3-188acdcebfc3', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('67248ad3-fe4c-478b-894c-ff6671f00e5a', 'ccb95402-2031-4d27-a17d-435fc425e6b8', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('76beed44-a3b2-4339-b25e-81be88c483ae', 'a7236b2a-91c7-4122-937f-7a70fcbcb66c', 'f4015be8-9d2a-4441-a532-4c58b6b682be', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('7ad71a39-e28c-48b9-9582-db1b0bd399c8', 'a881c582-ff3c-43c1-98c3-6c90157c5360', '14da6ba5-e41c-4825-a468-e55144d233f6', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('8dd5485d-3d82-4b00-862e-e7280a690071', 'c4e4038e-e93a-48f0-ad81-4afa7524fe49', '5f94109d-7d2c-461a-991d-c233313ce128', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('943d0a52-b43b-48c7-8dd7-36bb42d38f43', 'e780ed1b-498a-4dc8-bf8c-059aaa1d051e', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('94ddc5f9-37c4-4f43-8fed-0c857e09680c', 'a2afd5bb-0583-4259-94d5-811249127187', '14da6ba5-e41c-4825-a468-e55144d233f6', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a0a70395-a12a-4b06-add8-fcd45246b627', 'ae37bb0a-db03-4ccc-b37d-89a233cdfabe', '5f94109d-7d2c-461a-991d-c233313ce128', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('a3c41ebc-ae08-4ecf-a91a-21ea827e1902', 'ce9c18a5-921a-4c81-8ba9-2be577aff42e', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('cc65b059-06e3-48f9-9f14-cbb9da65ecd5', 'f7419006-f972-4b0b-b4fe-edfa6a08273c', '5f94109d-7d2c-461a-991d-c233313ce128', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ce513a32-9b8a-4600-b38d-1e628f003bed', 'facbfe59-6bf2-4783-84ed-949ed2ffc26e', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ce68f8b8-35c9-40f8-a852-c410bdea2323', '7b40a86d-c434-4131-9f04-23df5349ea3c', '5f94109d-7d2c-461a-991d-c233313ce128', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('e6e25c36-fc82-4c7b-b502-e1dc30888550', 'aeadb611-b031-49b4-b123-0fdd74e349b4', '14da6ba5-e41c-4825-a468-e55144d233f6', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('e8edd7fa-df0b-4a0c-b8b7-b3876bdd8809', '788d19f6-b601-4b10-a820-d3384b62c16e', '3f808a8a-d28b-4170-b749-1c3e5538e952', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f31cb3f5-25d9-4963-bfdd-a80169298e58', '2d744327-863d-4a79-b173-00e4dc42f7ea', '71c6818d-8c95-468a-979c-62ff555ad2c7', 'scheduled', NULL, NULL, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('f93d1b70-95b6-4ca6-a438-0a12867c56f2', '63ffea0e-4be8-44d9-8d13-88f90ac2d81d', '1f9112ef-6dbd-493a-b6ae-47526a04220e', 'scheduled', NULL, NULL, '2025-11-19 01:17:39', '2025-11-19 01:17:39');

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
('a184859d-26fc-4abb-9207-5af7a82849b3', 'sidebar_theme', '{\"backgroundColor\":\"#ffffff\",\"textColor\":\"#6b7280\",\"activeColor\":\"#27bcbb\",\"activeTextColor\":\"#ffffff\"}', 'Sidebar color theme settings', '2025-11-19 04:52:16', '2025-11-19 05:01:19');

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
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `trainings`
--

INSERT INTO `trainings` (`id`, `title`, `description`, `category`, `duration`, `isRequired`, `createdAt`, `updatedAt`) VALUES
('570dc884-9f3e-4594-a4fb-4a55f8fef134', 'Compounding Safety', 'Safety protocols for pharmaceutical compounding', 'Safety', 45, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('9c1e6ce1-4a72-4771-a6da-aaef545cc136', 'Pharmaceutical Calculations', 'Advanced pharmaceutical calculations and measurements', 'Technical', 90, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('aaa3194d-697a-46f7-8876-86cdb06a2f3d', 'HIPAA Compliance Training', 'Comprehensive HIPAA compliance and patient privacy training', 'HIPAA', 60, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('ba31fd19-2665-419b-a095-676613510a2a', 'Waste Management', 'Proper handling and disposal of pharmaceutical waste', 'Safety', 30, 1, '2025-11-19 01:05:32', '2025-11-19 01:05:32'),
('be96ea1c-72d4-4120-9d3c-cf6f13319c7f', 'OSHA Workplace Safety', 'Occupational safety and health administration training', 'Safety', 40, 0, '2025-11-19 01:05:32', '2025-11-19 01:05:32');

--
-- Indexes for dumped tables
--

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
-- Indexes for table `employee_onboarding_tasks`
--
ALTER TABLE `employee_onboarding_tasks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_task` (`employeeId`,`taskId`),
  ADD KEY `idx_employeeId` (`employeeId`),
  ADD KEY `idx_taskId` (`taskId`),
  ADD KEY `idx_status` (`status`);

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
  ADD KEY `idx_startDate` (`startDate`);

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
-- Indexes for table `policies`
--
ALTER TABLE `policies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`);

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
  ADD KEY `idx_date` (`date`);

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
-- Constraints for table `employee_onboarding_tasks`
--
ALTER TABLE `employee_onboarding_tasks`
  ADD CONSTRAINT `employee_onboarding_tasks_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_onboarding_tasks_ibfk_2` FOREIGN KEY (`taskId`) REFERENCES `onboarding_tasks` (`id`) ON DELETE CASCADE;

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
-- Constraints for table `shift_assignments`
--
ALTER TABLE `shift_assignments`
  ADD CONSTRAINT `shift_assignments_ibfk_1` FOREIGN KEY (`shiftId`) REFERENCES `shifts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shift_assignments_ibfk_2` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
