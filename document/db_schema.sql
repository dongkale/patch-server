

-- 패치 목록 테이블 
CREATE TABLE `patchs` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    
    `version` varchar(32) COLLATE utf8mb4_unicode_ci NULL DEFAULT '',

    -- `folder` varchar(128) COLLATE utf8mb4_unicode_ci NULL,    
    `file_name` varchar(128) COLLATE utf8mb4_unicode_ci NULL,    

    `checksum` varchar(128) COLLATE utf8mb4_unicode_ci NULL,
    `file_size` bigint unsigned NOT NULL,

    `force_update` tinyint(1) DEFAULT 0 COMMENT '0: 일반 업데이트, 1: 강제 업데이트',
    
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT NULL,
    
    PRIMARY KEY (`id`),
    INDEX `IX_patchs_version`(`version`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;