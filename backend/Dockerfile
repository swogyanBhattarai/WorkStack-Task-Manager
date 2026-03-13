FROM maven:3.9-openjdk-22 AS build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:22-jdk
COPY --from=build target/WorkStack-0.0.1-SNAPSHOT.jar WorkStack-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "WorkStack-0.0.1-SNAPSHOT.jar"]