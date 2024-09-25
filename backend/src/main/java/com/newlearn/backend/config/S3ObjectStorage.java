package com.newlearn.backend.config;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.Data;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Log4j2
@Data
@Service
public class S3ObjectStorage {

    private AmazonS3 amazonS3;
    private String bucket;
    private String aiS3Url;

    public S3ObjectStorage(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    @Async
    public CompletableFuture<String> uploadFile(MultipartFile multipartFile) {
        // UUID 이용해 고유한 파일명 생성
        String originalFileName = multipartFile.getOriginalFilename();
        String fileName = UUID.randomUUID() + "_" + originalFileName;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        try {
            amazonS3.putObject(bucket, fileName, multipartFile.getInputStream(), metadata);
            log.info("File uploaded to S3 with URL: {}", fileName);
        } catch (Exception e) {
            log.error("Failed to upload file to S3: {}", e.getMessage());
            return CompletableFuture.completedFuture(null); // 실패 시 null 반환
        }

        return CompletableFuture.completedFuture(amazonS3.getUrl(bucket, fileName).toString());
    }

    public void deleteFile(String fileUrl) {
        try {
            // URL에서 객체 키 추출
            URI uri = new URI(fileUrl);
            // URL의 첫 번째 '/'를 제거하여 객체 키 얻기
            String key = uri.getPath().substring(1);

            // 파일 존재 여부 확인
            if (amazonS3.doesObjectExist(bucket, key)) {
                amazonS3.deleteObject(bucket, key);
                log.info("File deleted successfully: {}", key);
            } else {
                log.warn("File not found: {}", key);
            }
        } catch (Exception e) {
            log.error("Failed to delete file!: {}", fileUrl, e);
        }
    }
}