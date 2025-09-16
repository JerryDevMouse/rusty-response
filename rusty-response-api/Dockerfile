FROM rust:latest as builder

WORKDIR /app

COPY Cargo.toml ./
RUN mkdir migrations
RUN mkdir src && echo 'fn main() {}' > src/main.rs
RUN cargo build --release
RUN rm -r src

COPY . .
RUN cargo build --release

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libssl3 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/rusty-response-api /app/rusty-response-api
COPY --from=builder /app/migrations /app/migrations

ENV RUST_LOG=rusty_response_api=info
CMD ["./rusty-response-api"]
