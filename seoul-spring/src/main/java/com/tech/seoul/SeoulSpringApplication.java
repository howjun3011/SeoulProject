package com.tech.seoul;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//[ 메인 엔트리 ]
@SpringBootApplication(scanBasePackages = "com.tech.*")
public class SeoulSpringApplication {
	public static void main(String[] args) {
		SpringApplication.run(SeoulSpringApplication.class, args);
	}
}
