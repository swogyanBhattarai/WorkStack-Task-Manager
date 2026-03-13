FROM maven:3.9-eclipse-temurin-17 AS build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk
COPY --from=build target/WorkStack-0.0.1-SNAPSHOT.jar WorkStack-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "WorkStack-0.0.1-SNAPSHOT.jar"]