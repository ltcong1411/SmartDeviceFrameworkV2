# SmartDeviceFrameworkV2

1.Install JDK 8
https://docs.oracle.com/javase/10/install/installation-jdk-and-jre-microsoft-windows-platforms.htm

2.Install Maven
https://www.mkyong.com/maven/how-to-install-maven-in-windows/

3.Clone source
https://github.com/ltcong1411/SmartDeviceFrameworkV2.git

4.Build (Run as Administrator)
mvn clean install -DskipTests

5.Install Cassandra DB
https://thingsboard.io/docs/user-guide/install/windows/

6.Start Server
cd ./application
mvn spring-boot:run