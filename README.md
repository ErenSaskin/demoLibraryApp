# demoLibraryApp

Run mongodb on port 27017.  
if your are using docker: "sudo docker run --name mongodb -d -p 27017:27017 mongo"  

dotnet restore  
dotnet build  
dotnet user-secrets init  
dotnet user-secrets set "OpenWeather:ApiKey" "{YourOpenWeatherApiKey}"  
dotnet run  

Listen to "https://localhost:5001" or "http://localhost:5000"
