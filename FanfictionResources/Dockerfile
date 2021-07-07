FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs
COPY ["ClientApp/package.json", "ClientApp/"]
COPY ["ClientApp/package-lock.json", "ClientApp/"]
WORKDIR /src/ClientApp
RUN npm install rimraf
RUN npm install
WORKDIR /src
COPY ["UsersControl.csproj", "."]
RUN dotnet restore "./FanfictionResources.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "FanfictionResources.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FanfictionResources.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FanfictionResources.dll"]