FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /app

# Copy everything and build
COPY . ./
RUN dotnet restore "./LibraryApp.csproj"
RUN dotnet publish "LibraryApp.csproj" -c Release -o out
RUN dotnet user-secrets init
RUN dotnet user-secrets set "OpenWeather:ApiKey" "6610c60631fffb2559b81898b0810dc2"

FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "LibraryApp.dll"]