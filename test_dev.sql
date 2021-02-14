/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE `test_dev`.`meals`;
CREATE TABLE `meals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type_id` bigint unsigned NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE `test_dev`.`type`;
CREATE TABLE `type` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE `test_dev`.`users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `meals` (`id`, `name`, `type_id`, `date`, `created_at`, `updated_at`) VALUES
(2, 'Gramhamsgrynsgröt', 2, '2021-02-14', '2021-02-14 12:21:02', '2021-02-14 12:21:02');
INSERT INTO `meals` (`id`, `name`, `type_id`, `date`, `created_at`, `updated_at`) VALUES
(3, 'Grahamsgrynsgrönt', 2, '2021-02-14', '2021-02-14 12:22:18', '2021-02-14 12:22:18');
INSERT INTO `meals` (`id`, `name`, `type_id`, `date`, `created_at`, `updated_at`) VALUES
(4, 'Grahamsgrynsgrönt', 2, '2021-02-14', '2021-02-14 12:22:50', '2021-02-14 12:22:50');
INSERT INTO `meals` (`id`, `name`, `type_id`, `date`, `created_at`, `updated_at`) VALUES
(5, 'Grahamsgrynsgrönt', 2, '2021-02-14', '2021-02-14 12:23:09', '2021-02-14 12:23:09'),
(6, 'Grahamsgrynsgrönt', 2, '2021-02-14', '2021-02-14 12:23:18', '2021-02-14 12:23:18'),
(7, 'Grahamsgrynsgrönt', 2, '2021-02-14', '2021-02-14 13:03:53', '2021-02-14 13:03:53'),
(8, 'Grahamsgrynsgrönt', 2, '2021-02-14', '2021-02-14 13:06:17', '2021-02-14 13:06:17'),
(9, 'Fläsk', 3, '2021-02-14', '2021-02-14 13:06:30', '2021-02-14 13:06:30'),
(10, 'Fläsk', 3, '2021-01-22', '2021-02-14 13:07:15', '2021-02-14 13:07:15');

INSERT INTO `type` (`id`, `name`) VALUES
(1, 'Frukost');
INSERT INTO `type` (`id`, `name`) VALUES
(2, 'Lunch');
INSERT INTO `type` (`id`, `name`) VALUES
(3, 'Middag');

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'korv', 'e', 'e', '2021-02-13 22:46:47', '2021-02-13 22:46:47');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;