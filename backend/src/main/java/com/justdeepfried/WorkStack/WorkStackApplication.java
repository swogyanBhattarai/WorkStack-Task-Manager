package com.justdeepfried.WorkStack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class WorkStackApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorkStackApplication.class, args);
	}

}
