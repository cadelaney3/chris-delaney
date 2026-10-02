FROM golang:1.27-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /api .

FROM gcr.io/distroless/static-debian12:nonroot
WORKDIR /app
COPY --from=build /api /app/api
COPY content /app/content
ENV CONTENT_DIR=/app/content/posts DATA_DIR=/data PORT=8080
EXPOSE 8080
ENTRYPOINT ["/app/api"]
