FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

# give permission to mvnw
RUN chmod +x mvnw

# build spring boot jar
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/*.jar"]