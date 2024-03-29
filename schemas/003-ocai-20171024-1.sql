CREATE DATABASE  IF NOT EXISTS `ocai` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `ocai`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 10.1.236.82    Database: ocai
-- ------------------------------------------------------
-- Server version	5.5.44-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `APP_INFO`
--

DROP TABLE IF EXISTS `APP_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `APP_INFO` (
  `APP_ID` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `APP_NAME` char(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `USER_NAME` char(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `NOTEBOOK_PATH` char(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`APP_ID`),
  UNIQUE KEY `UNIQUE` (`APP_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `APP_MAKEFILE`
--

DROP TABLE IF EXISTS `APP_MAKEFILE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `APP_MAKEFILE` (
  `ID` char(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `MAKEFILE_ID` int(11) DEFAULT NULL,
  `USER_NAME` char(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `APP_ID` char(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `TARGET` char(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `PREREQUISITES` char(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `FLAG` char(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_APP_NAME_idx` (`APP_ID`),
  KEY `FK1_MODELS` (`TARGET`),
  CONSTRAINT `12` FOREIGN KEY (`APP_ID`) REFERENCES `APP_INFO` (`APP_NAME`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `APP_RESULTS`
--

DROP TABLE IF EXISTS `APP_RESULTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `APP_RESULTS` (
  `ID` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `SCHEDULE_NAME` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `APP_NAME` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `EXECUTE_TIME` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `SCHEDULE_TARGET` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `EXECUTE_STATUS` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `RESULTS_LIST` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `APP_SCHEDULE`
--

DROP TABLE IF EXISTS `APP_SCHEDULE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `APP_SCHEDULE` (
  `id` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `app_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `schedule_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `command` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `second` int(11) DEFAULT NULL,
  `minute` int(11) DEFAULT NULL,
  `hour` int(11) DEFAULT NULL,
  `date` int(11) DEFAULT NULL,
  `month` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `dayOfWeek` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_schedule` (`app_id`),
  CONSTRAINT `fk_schedule` FOREIGN KEY (`app_id`) REFERENCES `APP_INFO` (`APP_NAME`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MODEL_INFO`
--

DROP TABLE IF EXISTS `MODEL_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MODEL_INFO` (
  `MODEL_ID` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `USER_NAME` char(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `TYPE_MENU_ID` char(2) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `VIEW_MENU_ID` char(2) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `MODEL_NAME` char(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `NOTEBOOK_PATH` char(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `UPDATED_TIME` date NOT NULL,
  `COMMENT` text COLLATE utf8_unicode_ci,
  `FILE_PATH` text COLLATE utf8_unicode_ci NOT NULL,
  `MODEL_INFO` text COLLATE utf8_unicode_ci,
  `APP_ID` char(32) COLLATE utf8_unicode_ci DEFAULT '',
  `KERNEL` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MODEL_ID`),
  KEY `FK_MAKEFILE_idx` (`MODEL_NAME`),
  KEY `UNIQUE` (`MODEL_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `USER_INFO`
--

DROP TABLE IF EXISTS `USER_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USER_INFO` (
  `USER_ID` char(32) COLLATE utf8_unicode_ci NOT NULL,
  `USER_NAME` char(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `PASSWORD` char(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `NOTEBOOK_SERVER_URL` char(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `JUPYTER_TOKEN` char(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `EMAIL` char(32) COLLATE utf8_unicode_ci DEFAULT '',
  PRIMARY KEY (`USER_ID`),
  UNIQUE KEY `USER_NAME` (`USER_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Dumping data for table `USER_INFO`
--

LOCK TABLES `USER_INFO` WRITE;
/*!40000 ALTER TABLE `USER_INFO` DISABLE KEYS */;
INSERT INTO `USER_INFO` VALUES ('6789900e','admin','21232f297a57a5a743894a0e4a801fc3',NULL,NULL,'');
/*!40000 ALTER TABLE `USER_INFO` ENABLE KEYS */;
UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-24 15:12:54
