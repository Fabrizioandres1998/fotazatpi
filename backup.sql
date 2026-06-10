-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: maglev.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20260527022424-create-usuario.js'),('20260527022437-create-publicacion.js'),('20260527041218-create-imagen-table.js'),('20260528044451-create-etiqueta.js'),('20260528051958-publicacion_etiqueta.js'),('20260602143322-create-comentario.js'),('20260602230243-create-follower.js'),('20260603031621-create-valoracion.js'),('20260603155931-create-reporte-publicacion.js'),('20260604004832-add_publicaciones_eliminadas_to_usuario.js'),('20260604214422-create-me-interesa.js'),('20260604224605-create-notificacion.js'),('20260604235227-create-mensaje.js'),('20260605001346-add_id_publicacion_to_notificaciones.js'),('20260608152924-create-reporte-comentario.js'),('20260608182441-create-coleccion.js'),('20260608182624-create-coleccion-publicacion.js'),('20260609000823-add_unique_constraint_to_usuario.js'),('20260610144259-add_comentarios_cerrados_to_publicacion.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sessions`
--

DROP TABLE IF EXISTS `Sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sessions`
--

LOCK TABLES `Sessions` WRITE;
/*!40000 ALTER TABLE `Sessions` DISABLE KEYS */;
INSERT INTO `Sessions` VALUES ('uPdQkOfWrAWUemNK5deIOEcgd1QbOyxi','2026-06-11 20:22:38','{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-06-11T20:21:27.791Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"id_usuario\":11,\"rol\":\"usuario\",\"username\":\"chino123\"}','2026-06-10 20:21:27','2026-06-10 20:22:38');
/*!40000 ALTER TABLE `Sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coleccion_publicacion`
--

DROP TABLE IF EXISTS `coleccion_publicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coleccion_publicacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_coleccion` int NOT NULL,
  `id_publicacion` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_coleccion_publicacion` (`id_coleccion`,`id_publicacion`),
  KEY `id_publicacion` (`id_publicacion`),
  CONSTRAINT `coleccion_publicacion_ibfk_1` FOREIGN KEY (`id_coleccion`) REFERENCES `colecciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `coleccion_publicacion_ibfk_2` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coleccion_publicacion`
--

LOCK TABLES `coleccion_publicacion` WRITE;
/*!40000 ALTER TABLE `coleccion_publicacion` DISABLE KEYS */;
INSERT INTO `coleccion_publicacion` VALUES (1,1,5,'2026-06-10 16:01:10','2026-06-10 16:01:10'),(2,2,6,'2026-06-10 19:00:17','2026-06-10 19:00:17'),(3,2,7,'2026-06-10 19:00:29','2026-06-10 19:00:29'),(4,1,13,'2026-06-10 20:14:45','2026-06-10 20:14:45');
/*!40000 ALTER TABLE `coleccion_publicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colecciones`
--

DROP TABLE IF EXISTS `colecciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colecciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `colecciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colecciones`
--

LOCK TABLES `colecciones` WRITE;
/*!40000 ALTER TABLE `colecciones` DISABLE KEYS */;
INSERT INTO `colecciones` VALUES (1,10,'Animales','2026-06-10 16:00:39','2026-06-10 16:00:39'),(2,7,'Musica','2026-06-10 18:59:53','2026-06-10 18:59:53');
/*!40000 ALTER TABLE `colecciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentario`
--

DROP TABLE IF EXISTS `comentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `texto` text,
  `id_usuario` int DEFAULT NULL,
  `id_publicacion` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentario`
--

LOCK TABLES `comentario` WRITE;
/*!40000 ALTER TABLE `comentario` DISABLE KEYS */;
INSERT INTO `comentario` VALUES (1,'Buen post!',8,2,'2026-06-04 04:01:32','2026-06-04 04:01:32'),(2,'Me gusta esta publicacion!',8,3,'2026-06-10 15:39:55','2026-06-10 15:39:55'),(3,'Muy buena',10,2,'2026-06-10 16:01:51','2026-06-10 16:01:51'),(4,'Gran banda',7,6,'2026-06-10 18:59:36','2026-06-10 18:59:36'),(5,'la mejor banda',8,6,'2026-06-10 19:04:09','2026-06-10 19:04:09');
/*!40000 ALTER TABLE `comentario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etiqueta`
--

DROP TABLE IF EXISTS `etiqueta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etiqueta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etiqueta`
--

LOCK TABLES `etiqueta` WRITE;
/*!40000 ALTER TABLE `etiqueta` DISABLE KEYS */;
INSERT INTO `etiqueta` VALUES (5,'anime','2026-06-04 04:00:50','2026-06-04 04:00:50'),(6,'manga','2026-06-04 04:00:50','2026-06-04 04:00:50'),(7,'videojuegos','2026-06-04 04:00:50','2026-06-04 04:00:50'),(8,'noche','2026-06-10 14:00:59','2026-06-10 14:00:59'),(9,'paisaje','2026-06-10 15:53:02','2026-06-10 15:53:02'),(10,'san luis','2026-06-10 15:53:02','2026-06-10 15:53:02'),(11,'naturaleza','2026-06-10 15:53:02','2026-06-10 15:53:02'),(12,'turismo','2026-06-10 15:53:02','2026-06-10 15:53:02'),(13,'aves','2026-06-10 15:58:15','2026-06-10 15:58:15'),(14,'fauna','2026-06-10 15:58:15','2026-06-10 15:58:15'),(15,'animales','2026-06-10 15:58:15','2026-06-10 15:58:15'),(16,'banda','2026-06-10 16:11:31','2026-06-10 16:11:31'),(17,'rock','2026-06-10 16:11:31','2026-06-10 16:11:31'),(18,'musica','2026-06-10 16:11:31','2026-06-10 16:11:31'),(19,'deporte','2026-06-10 18:35:49','2026-06-10 18:35:49'),(20,'bicicleta','2026-06-10 18:35:49','2026-06-10 18:35:49'),(21,'boxeo','2026-06-10 18:39:58','2026-06-10 18:39:58'),(22,'calistenia','2026-06-10 18:55:35','2026-06-10 18:55:35'),(23,'animal','2026-06-10 20:13:54','2026-06-10 20:13:54'),(24,'salvaje','2026-06-10 20:13:54','2026-06-10 20:13:54'),(25,'nu metal','2026-06-10 20:16:23','2026-06-10 20:16:23');
/*!40000 ALTER TABLE `etiqueta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follower`
--

DROP TABLE IF EXISTS `follower`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follower` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_seguidor` int NOT NULL,
  `id_seguido` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_seguidor_seguido` (`id_seguidor`,`id_seguido`),
  KEY `id_seguido` (`id_seguido`),
  CONSTRAINT `follower_ibfk_1` FOREIGN KEY (`id_seguidor`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `follower_ibfk_2` FOREIGN KEY (`id_seguido`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follower`
--

LOCK TABLES `follower` WRITE;
/*!40000 ALTER TABLE `follower` DISABLE KEYS */;
INSERT INTO `follower` VALUES (2,8,7,'2026-06-04 04:01:47','2026-06-04 04:01:47'),(3,10,8,'2026-06-10 16:01:00','2026-06-10 16:01:00'),(4,7,10,'2026-06-10 19:00:08','2026-06-10 19:00:08'),(5,10,7,'2026-06-10 20:21:09','2026-06-10 20:21:09'),(6,11,10,'2026-06-10 20:21:42','2026-06-10 20:21:42'),(7,11,8,'2026-06-10 20:21:44','2026-06-10 20:21:44'),(8,11,7,'2026-06-10 20:21:46','2026-06-10 20:21:46');
/*!40000 ALTER TABLE `follower` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagen`
--

DROP TABLE IF EXISTS `imagen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagen` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `marca_agua` varchar(255) DEFAULT NULL,
  `licencia` enum('copyright','sin_copyright') NOT NULL,
  `id_publicacion` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_publicacion` (`id_publicacion`),
  CONSTRAINT `imagen_ibfk_1` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagen`
--

LOCK TABLES `imagen` WRITE;
/*!40000 ALTER TABLE `imagen` DISABLE KEYS */;
INSERT INTO `imagen` VALUES (4,'https://c4.wallpaperflare.com/wallpaper/121/540/894/evangelion-neon-genesis-evangelion-evangelion-unit-01-wallpaper-preview.jpg',NULL,'sin_copyright',2,'2026-06-04 04:00:50','2026-06-04 04:00:50'),(5,'https://images4.alphacoders.com/135/1355110.jpeg',NULL,'sin_copyright',2,'2026-06-04 04:00:50','2026-06-04 04:00:50'),(6,'https://images.wallpapersden.com/image/download/4k-rog-x-evangelion_bW1sZW6UmZqaraWkpJRobWllrWdma2U.jpg',NULL,'sin_copyright',2,'2026-06-04 04:00:50','2026-06-04 04:00:50'),(7,'https://sm.ign.com/ign_latam/screenshot/default/alucard_xamx.jpg','fabrizioandres98-copyright','copyright',3,'2026-06-10 14:00:59','2026-06-10 14:00:59'),(8,'https://wallpapercat.com/w/full/6/0/6/736066-3840x2160-desktop-4k-hellsing-wallpaper-image.jpg','fabrizioandres98-copyright','copyright',3,'2026-06-10 14:00:59','2026-06-10 14:00:59'),(9,'https://c4.wallpaperflare.com/wallpaper/735/371/672/anime-hellsing-alucard-hellsing-hd-wallpaper-preview.jpg','fabrizioandres98-copyright','copyright',3,'2026-06-10 14:00:59','2026-06-10 14:00:59'),(10,'https://i0.wp.com/apuntesyviajes.com/wp-content/uploads/2023/07/san_luis_argentina.jpg?fit=1200%2C900&ssl=1','vatata77-copyright','copyright',4,'2026-06-10 15:53:02','2026-06-10 15:53:02'),(11,'https://infomerlo-s3.cdn.net.ar/s3i233/2025/08/infomerlo/images/02/24/67/2246768_c33218cb73f0666b8b96ab9563eb167c0f54cb96bece9d1a664bba2eb760deaa/md.webp','vatata77-copyright','copyright',4,'2026-06-10 15:53:02','2026-06-10 15:53:02'),(12,'https://i0.wp.com/leerdelviaje.com/wp-content/uploads/2019/10/20191004_153744.jpg?resize=1098.5%2C556&ssl=1','vatata77-copyright','copyright',4,'2026-06-10 15:53:02','2026-06-10 15:53:02'),(13,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV_96Z4_3JCUX_I9QzYQDTwpixTg1ChByP54RcNifF5tTz17B7mOAtoiVx&s=10',NULL,'sin_copyright',5,'2026-06-10 15:58:15','2026-06-10 15:58:15'),(14,'https://agenciasanluis.com/wp-content/uploads/2024/11/WhatsApp-Image-2024-01-09-at-13.43.10.jpeg',NULL,'sin_copyright',5,'2026-06-10 15:58:15','2026-06-10 15:58:15'),(15,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjZ5tGXiFZF7yR2MLy3LkZwI16d7xP36Tqv8fJycBGh_xmiLYza9m1pNM&s=10',NULL,'sin_copyright',5,'2026-06-10 15:58:15','2026-06-10 15:58:15'),(16,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOm6KgujgK5vHtJFkhHqxqM4X9kK4IK9tQuj3JY3wnFvjUn1wkxjJNGoLM&s=10',NULL,'sin_copyright',6,'2026-06-10 16:11:31','2026-06-10 16:11:31'),(17,'https://www.nuclearblast.com/cdn/shop/collections/20240206_deftones_accountheader_b8c899bf-14d1-41ca-be22-8281e5781cc7.jpg?v=1752227539',NULL,'sin_copyright',6,'2026-06-10 16:11:31','2026-06-10 16:11:31'),(18,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZraWxHrbLH4ZralsFof_C4glQb5XnIxumxEJWjoLppbukhuUL0mUzGTI&s=10','prueba12-copyright','copyright',7,'2026-06-10 18:29:37','2026-06-10 18:29:37'),(19,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsdLg4Ib_60p1t9SassOL9gubmkEYmya5Ks3dZ02nOxkN7UCAzPxCgDtJB&s=10','prueba12-copyright','copyright',7,'2026-06-10 18:29:37','2026-06-10 18:29:37'),(20,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoMT7FqnOqNm5DTWjNRcEPZtBKrOdf5q09s6KkubM08pdh4WeLPDvt1wQ&s=10','prueba12-copyright','copyright',7,'2026-06-10 18:29:37','2026-06-10 18:29:37'),(21,'https://wallpaperaccess.com/full/4439913.jpg',NULL,'sin_copyright',8,'2026-06-10 18:35:49','2026-06-10 18:35:49'),(22,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVO2w_gskChxwTMsiAZwqgsvd3DpwlTsIYiCKxI7-kJ-_NBjh58gnqMTQ&s=10',NULL,'sin_copyright',8,'2026-06-10 18:35:49','2026-06-10 18:35:49'),(23,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqro9wWyoN1ojSHIyNlprJWC5eVgExl3qjxH2l6PuwEPR-cXivcXut-H8&s=10',NULL,'sin_copyright',8,'2026-06-10 18:35:49','2026-06-10 18:35:49'),(24,'https://www.lacapital.com.ar//adjuntos/203/imagenes/020/070/0020070537.jpg?0000-00-00-00-00-00','chino123-copyright','copyright',9,'2026-06-10 18:39:58','2026-06-10 18:39:58'),(26,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAtP-QwAacqU9UA3NiMq173CT2fNrKfzuBQGH6ubU4h35-CCTaH1oN3TQ&s=10',NULL,'sin_copyright',11,'2026-06-10 18:55:35','2026-06-10 18:55:35'),(27,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp9CmvZYdjJuMh1HIFjOw0Pr1-jKfcL-YJV24gn5Eo1jQrNFbv8o7LZAe-&s=10',NULL,'sin_copyright',11,'2026-06-10 18:55:35','2026-06-10 18:55:35'),(28,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjsAJEBbOPEtS_rXgLCKtSWAr4qVS89one-zEYQEz9kz-W_7oWHB_2x8c&s=10',NULL,'sin_copyright',11,'2026-06-10 18:55:35','2026-06-10 18:55:35'),(29,'https://sm.ign.com/ign_latam/screenshot/default/berserk-continuara-sin-kentaro-miura_hn64.jpg',NULL,'sin_copyright',12,'2026-06-10 18:58:04','2026-06-10 18:58:04'),(30,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScrgp3X7Uw-rGyTK4LtB4ErVE5DqC8QKC5byxdoJb9_HWMSAYgJziTPetR&s=10',NULL,'sin_copyright',12,'2026-06-10 18:58:04','2026-06-10 18:58:04'),(31,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgObK6C0_eBzeO8cxY20gt3KFCL5IVtd_5edKX-90ZfALfU7F1ksD7624&s=10',NULL,'sin_copyright',13,'2026-06-10 20:13:54','2026-06-10 20:13:54'),(32,'https://images3.alphacoders.com/818/thumb-1920-81807.jpg',NULL,'sin_copyright',14,'2026-06-10 20:16:23','2026-06-10 20:16:23');
/*!40000 ALTER TABLE `imagen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `me_interesa`
--

DROP TABLE IF EXISTS `me_interesa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `me_interesa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_publicacion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_usuario_publicacion_interes` (`id_usuario`,`id_publicacion`),
  KEY `id_publicacion` (`id_publicacion`),
  CONSTRAINT `me_interesa_ibfk_1` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `me_interesa_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `me_interesa`
--

LOCK TABLES `me_interesa` WRITE;
/*!40000 ALTER TABLE `me_interesa` DISABLE KEYS */;
INSERT INTO `me_interesa` VALUES (2,2,8,'2026-06-06 02:31:07','2026-06-06 02:31:07'),(5,3,8,'2026-06-10 15:42:02','2026-06-10 15:42:02'),(6,7,7,'2026-06-10 19:00:39','2026-06-10 19:00:39');
/*!40000 ALTER TABLE `me_interesa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensaje`
--

DROP TABLE IF EXISTS `mensaje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensaje` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_remitente` int NOT NULL,
  `id_destinatario` int NOT NULL,
  `id_publicacion` int DEFAULT NULL,
  `mensaje` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_remitente` (`id_remitente`),
  KEY `id_destinatario` (`id_destinatario`),
  KEY `id_publicacion` (`id_publicacion`),
  CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`id_remitente`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mensaje_ibfk_2` FOREIGN KEY (`id_destinatario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mensaje_ibfk_3` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensaje`
--

LOCK TABLES `mensaje` WRITE;
/*!40000 ALTER TABLE `mensaje` DISABLE KEYS */;
INSERT INTO `mensaje` VALUES (1,7,8,NULL,'hola','2026-06-06 02:35:12','2026-06-06 02:35:12'),(2,8,7,NULL,'hola','2026-06-08 18:17:59','2026-06-08 18:17:59'),(3,7,8,NULL,'Te interesa adquirir alguna de las imagenes de la publicacion?','2026-06-10 18:58:42','2026-06-10 18:58:42');
/*!40000 ALTER TABLE `mensaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario_destino` int NOT NULL,
  `id_usuario_origen` int DEFAULT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `id_publicacion` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario_destino` (`id_usuario_destino`),
  KEY `id_usuario_origen` (`id_usuario_origen`),
  KEY `notificaciones_id_publicacion_foreign_idx` (`id_publicacion`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario_destino`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`id_usuario_origen`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `notificaciones_id_publicacion_foreign_idx` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,7,8,'quiere adquirir tu publicación \"Evangelion\"',1,'2026-06-06 01:59:07','2026-06-06 02:06:37',2),(2,7,8,'quiere adquirir tu publicación \"Evangelion\"',1,'2026-06-06 02:31:07','2026-06-06 15:41:07',2),(3,8,7,'fabrizioandres98 te envió un mensaje',1,'2026-06-06 02:35:12','2026-06-08 18:18:03',NULL),(4,7,8,'vatata77 te envió un mensaje',1,'2026-06-08 18:17:59','2026-06-08 18:18:32',NULL),(5,7,7,'Se reportó un comentario en tu publicación <a href=\"/publicaciones/2\">\"Evangelion\"</a>',1,'2026-06-08 18:18:44','2026-06-08 18:18:51',NULL),(6,7,8,'valoró tu publicación con 4',0,'2026-06-10 15:39:45','2026-06-10 15:39:45',NULL),(7,7,8,'quiere adquirir tu publicación \"Hellsing \"',0,'2026-06-10 15:40:06','2026-06-10 15:40:06',3),(8,7,8,'quiere adquirir tu publicación \"Hellsing \"',0,'2026-06-10 15:41:45','2026-06-10 15:41:45',3),(9,7,8,'quiere adquirir tu publicación \"Hellsing \"',0,'2026-06-10 15:42:02','2026-06-10 15:42:02',3),(10,8,10,'valoró tu publicación con 5',0,'2026-06-10 16:00:01','2026-06-10 16:00:01',NULL),(11,8,10,'comenzo a seguirte',0,'2026-06-10 16:01:00','2026-06-10 16:01:00',NULL),(12,7,10,'valoró tu publicación con 3',0,'2026-06-10 16:01:37','2026-06-10 16:01:37',NULL),(13,8,7,'fabrizioandres98 te envió un mensaje',0,'2026-06-10 18:58:42','2026-06-10 18:58:42',NULL),(14,10,7,'valoró tu publicación con 5',0,'2026-06-10 18:59:26','2026-06-10 18:59:26',NULL),(15,10,7,'comenzo a seguirte',0,'2026-06-10 19:00:08','2026-06-10 19:00:08',NULL),(16,10,7,'quiere adquirir tu publicación \"Catupecu machu\"',0,'2026-06-10 19:00:39','2026-06-10 19:00:39',7),(17,11,7,'valoró tu publicación con 3',0,'2026-06-10 19:00:57','2026-06-10 19:00:57',NULL),(18,10,7,'valoró tu publicación con 4',0,'2026-06-10 19:01:30','2026-06-10 19:01:30',NULL),(19,10,8,'valoró tu publicación con 5',0,'2026-06-10 19:04:00','2026-06-10 19:04:00',NULL),(20,11,8,'valoró tu publicación con 3',0,'2026-06-10 19:04:42','2026-06-10 19:04:42',NULL),(21,11,8,'valoró tu publicación con 5',0,'2026-06-10 19:06:52','2026-06-10 19:06:52',NULL),(22,10,11,'valoró tu publicación con 4',0,'2026-06-10 19:12:51','2026-06-10 19:12:51',NULL),(23,11,9,'valoró tu publicación con 3',0,'2026-06-10 19:14:29','2026-06-10 19:14:29',NULL),(24,7,10,'comenzo a seguirte',0,'2026-06-10 20:21:09','2026-06-10 20:21:09',NULL),(25,10,11,'comenzo a seguirte',0,'2026-06-10 20:21:42','2026-06-10 20:21:42',NULL),(26,8,11,'comenzo a seguirte',0,'2026-06-10 20:21:44','2026-06-10 20:21:44',NULL),(27,7,11,'comenzo a seguirte',0,'2026-06-10 20:21:46','2026-06-10 20:21:46',NULL);
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publicacion`
--

DROP TABLE IF EXISTS `publicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `id_usuario` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `comentarios_cerrados` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `publicacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicacion`
--

LOCK TABLES `publicacion` WRITE;
/*!40000 ALTER TABLE `publicacion` DISABLE KEYS */;
INSERT INTO `publicacion` VALUES (2,'Evangelion','Post de imagenes de Evangelion',7,'2026-06-04 04:00:50','2026-06-04 04:00:50',0),(3,'Hellsing ','Post de imagenes de Hellsing',7,'2026-06-10 14:00:59','2026-06-10 14:00:59',0),(4,'Postales de San Luis','Algunas postales de la provincia de San Luis',8,'2026-06-10 15:53:02','2026-06-10 15:53:24',1),(5,'Aves de San Luis','Algunas aves fotografiadas en San Luis',8,'2026-06-10 15:58:15','2026-06-10 15:58:15',0),(6,'Deftones','Fotos de la banda Deftones',10,'2026-06-10 16:11:31','2026-06-10 16:11:31',0),(7,'Catupecu machu','Fotos de la banda Catupecu machu',10,'2026-06-10 18:29:37','2026-06-10 18:29:37',0),(8,'Bicicletas fixie','Modelos de bicicletas de piñon fijo',11,'2026-06-10 18:35:49','2026-06-10 18:35:49',0),(9,'Sugar Ray Leonard vs Marvin Hagler','Foto de la pelea entre Leonard y Hagler en el año 1987',11,'2026-06-10 18:39:58','2026-06-10 20:22:31',0),(11,'Calistenia','Fotos de personas haciendo calistenia',11,'2026-06-10 18:55:35','2026-06-10 18:55:35',0),(12,'Berserk','Imagenes del manga Berserk',7,'2026-06-10 18:58:04','2026-06-10 18:58:04',0),(13,'Aguara Guazu','Foto de un Aguara Guazu',8,'2026-06-10 20:13:54','2026-06-10 20:13:54',0),(14,'Linkin Park','Wallpaper de Linkin Park',10,'2026-06-10 20:16:23','2026-06-10 20:16:23',0);
/*!40000 ALTER TABLE `publicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publicacion_etiqueta`
--

DROP TABLE IF EXISTS `publicacion_etiqueta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicacion_etiqueta` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `id_etiqueta` int NOT NULL,
  `id_publicacion` int NOT NULL,
  PRIMARY KEY (`id_etiqueta`,`id_publicacion`),
  KEY `id_publicacion` (`id_publicacion`),
  CONSTRAINT `publicacion_etiqueta_ibfk_1` FOREIGN KEY (`id_etiqueta`) REFERENCES `etiqueta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `publicacion_etiqueta_ibfk_2` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicacion_etiqueta`
--

LOCK TABLES `publicacion_etiqueta` WRITE;
/*!40000 ALTER TABLE `publicacion_etiqueta` DISABLE KEYS */;
INSERT INTO `publicacion_etiqueta` VALUES ('2026-06-04 04:00:50','2026-06-04 04:00:50',5,2),('2026-06-10 14:00:59','2026-06-10 14:00:59',5,3),('2026-06-10 18:58:04','2026-06-10 18:58:04',5,12),('2026-06-04 04:00:50','2026-06-04 04:00:50',6,2),('2026-06-10 14:00:59','2026-06-10 14:00:59',6,3),('2026-06-10 18:58:04','2026-06-10 18:58:04',6,12),('2026-06-04 04:00:50','2026-06-04 04:00:50',7,2),('2026-06-10 14:00:59','2026-06-10 14:00:59',7,3),('2026-06-10 14:00:59','2026-06-10 14:00:59',8,3),('2026-06-10 18:58:04','2026-06-10 18:58:04',8,12),('2026-06-10 15:53:02','2026-06-10 15:53:02',9,4),('2026-06-10 15:58:15','2026-06-10 15:58:15',9,5),('2026-06-10 15:53:02','2026-06-10 15:53:02',10,4),('2026-06-10 15:53:02','2026-06-10 15:53:02',11,4),('2026-06-10 18:55:35','2026-06-10 18:55:35',11,11),('2026-06-10 15:53:02','2026-06-10 15:53:02',12,4),('2026-06-10 15:58:15','2026-06-10 15:58:15',13,5),('2026-06-10 15:58:15','2026-06-10 15:58:15',14,5),('2026-06-10 15:58:15','2026-06-10 15:58:15',15,5),('2026-06-10 16:11:31','2026-06-10 16:11:31',16,6),('2026-06-10 18:29:37','2026-06-10 18:29:37',16,7),('2026-06-10 16:11:31','2026-06-10 16:11:31',17,6),('2026-06-10 18:29:37','2026-06-10 18:29:37',17,7),('2026-06-10 20:16:23','2026-06-10 20:16:23',17,14),('2026-06-10 16:11:31','2026-06-10 16:11:31',18,6),('2026-06-10 20:16:23','2026-06-10 20:16:23',18,14),('2026-06-10 18:35:49','2026-06-10 18:35:49',19,8),('2026-06-10 18:39:58','2026-06-10 18:39:58',19,9),('2026-06-10 18:55:35','2026-06-10 18:55:35',19,11),('2026-06-10 18:35:49','2026-06-10 18:35:49',20,8),('2026-06-10 18:39:58','2026-06-10 18:39:58',21,9),('2026-06-10 18:55:35','2026-06-10 18:55:35',22,11),('2026-06-10 20:13:54','2026-06-10 20:13:54',23,13),('2026-06-10 20:13:54','2026-06-10 20:13:54',24,13),('2026-06-10 20:16:23','2026-06-10 20:16:23',25,14);
/*!40000 ALTER TABLE `publicacion_etiqueta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporte_comentario`
--

DROP TABLE IF EXISTS `reporte_comentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporte_comentario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_comentario` int NOT NULL,
  `id_usuario` int NOT NULL,
  `motivo` enum('spam','contenido_inapropiado','violencia','odio','copyright') NOT NULL,
  `descripcion` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_usuario_comentario_reporte` (`id_usuario`,`id_comentario`),
  KEY `id_comentario` (`id_comentario`),
  CONSTRAINT `reporte_comentario_ibfk_1` FOREIGN KEY (`id_comentario`) REFERENCES `comentario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reporte_comentario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporte_comentario`
--

LOCK TABLES `reporte_comentario` WRITE;
/*!40000 ALTER TABLE `reporte_comentario` DISABLE KEYS */;
INSERT INTO `reporte_comentario` VALUES (1,1,7,'contenido_inapropiado',NULL,'2026-06-08 18:18:44','2026-06-08 18:18:44');
/*!40000 ALTER TABLE `reporte_comentario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporte_publicacion`
--

DROP TABLE IF EXISTS `reporte_publicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporte_publicacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_publicacion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `motivo` enum('spam','contenido_inapropiado','violencia','odio','copyright','otro') NOT NULL,
  `descripcion` text,
  `estado` enum('pendiente','revisado','resuelto') NOT NULL DEFAULT 'pendiente',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_usuario_publicacion_reporte` (`id_usuario`,`id_publicacion`),
  KEY `id_publicacion` (`id_publicacion`),
  CONSTRAINT `reporte_publicacion_ibfk_1` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reporte_publicacion_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporte_publicacion`
--

LOCK TABLES `reporte_publicacion` WRITE;
/*!40000 ALTER TABLE `reporte_publicacion` DISABLE KEYS */;
INSERT INTO `reporte_publicacion` VALUES (1,2,8,'spam','Repetitivo','pendiente','2026-06-06 01:59:22','2026-06-06 01:59:22'),(2,5,10,'copyright','Fotos robadas','pendiente','2026-06-10 16:12:31','2026-06-10 16:12:31'),(3,5,7,'copyright',NULL,'pendiente','2026-06-10 19:10:43','2026-06-10 19:10:43'),(4,5,11,'copyright',NULL,'pendiente','2026-06-10 19:11:22','2026-06-10 19:11:22');
/*!40000 ALTER TABLE `reporte_publicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT NULL,
  `rol` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `publicaciones_eliminadas` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (7,'fabrizioandres98','fabrizioandres98@gmail.com','$2b$10$B/8wYwfBLtGFbdUtn0vR7eCk8Z22HqG3KgHSgN6OC8yCN24ARuF0.',1,NULL,'2026-06-04 03:48:27','2026-06-04 03:48:27',0),(8,'vatata77','vati77@gmail.com','$2b$10$cWT3IWDDx8bT89ki8z3ubOPIgRMlsYmzPy/RgTQFdKTUPEIaYIz6a',1,'usuario','2026-06-04 03:51:08','2026-06-04 03:51:08',0),(9,'moderador','moderador@gmail.com','$2b$10$HRfgeFZ9PPrQiUUtG2R43.4BNYC5C8xwtScoZMRFG/xFyRhrtKbHC',1,'moderador','2026-06-10 14:02:20','2026-06-10 14:02:20',0),(10,'prueba12','prueba12@gmail.com','$2b$10$WpyTngavkAQJPNCslUB8muBDAOkS7qR5fO8NRPYVipL/H3RCefm9a',1,'usuario','2026-06-10 15:59:23','2026-06-10 15:59:23',0),(11,'chino123','chino123@gmail.com','$2b$10$2lG5g4KZtOPisHtym8/4NuDHWu31aGUvMlZwAv6emQOtda2EdZkri',1,'usuario','2026-06-10 18:32:27','2026-06-10 18:32:27',0);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valoracion`
--

DROP TABLE IF EXISTS `valoracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valoracion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_publicacion` int NOT NULL,
  `puntaje` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_usuario_publicacion` (`id_usuario`,`id_publicacion`),
  KEY `id_publicacion` (`id_publicacion`),
  CONSTRAINT `valoracion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `valoracion_ibfk_2` FOREIGN KEY (`id_publicacion`) REFERENCES `publicacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valoracion`
--

LOCK TABLES `valoracion` WRITE;
/*!40000 ALTER TABLE `valoracion` DISABLE KEYS */;
INSERT INTO `valoracion` VALUES (1,8,2,5,'2026-06-04 04:01:24','2026-06-06 01:59:03'),(2,8,3,4,'2026-06-10 15:39:45','2026-06-10 15:39:45'),(3,10,4,5,'2026-06-10 16:00:01','2026-06-10 16:00:01'),(4,10,2,3,'2026-06-10 16:01:37','2026-06-10 16:01:37'),(5,7,6,5,'2026-06-10 18:59:26','2026-06-10 18:59:26'),(10,7,9,3,'2026-06-10 19:00:57','2026-06-10 19:00:57'),(11,7,7,4,'2026-06-10 19:01:30','2026-06-10 19:01:30'),(12,8,6,5,'2026-06-10 19:04:00','2026-06-10 19:04:00'),(13,8,8,3,'2026-06-10 19:04:42','2026-06-10 19:04:42'),(14,8,9,5,'2026-06-10 19:06:52','2026-06-10 19:06:52'),(15,11,6,4,'2026-06-10 19:12:51','2026-06-10 19:12:51'),(16,9,8,3,'2026-06-10 19:14:29','2026-06-10 19:14:29');
/*!40000 ALTER TABLE `valoracion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-10 17:54:16
