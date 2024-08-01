
CREATE TABLE `patchs` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    
    `vesion` varchar(128) COLLATE utf8mb4_unicode_ci NULL DEFAULT '',

    `file_name` varchar(512) COLLATE utf8mb4_unicode_ci NULL,
    `checksum` varchar(128) COLLATE utf8mb4_unicode_ci NULL,
    
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT NULL,
    
    PRIMARY KEY (`id`),
    UNIQUE INDEX `IX_patchs_vesion`(`vesion`) USING BTREE,    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;