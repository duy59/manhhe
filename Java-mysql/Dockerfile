# Build stage
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml và download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code và build application
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy jar file từ build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/materials || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
