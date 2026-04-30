FROM debian:trixie-slim 

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
WORKDIR /app

#RUN groupadd -r mcpuser && useradd -r -g mcpuser -m -d /home/mcpuser mcpuser && chown -R mcpuser:mcpuser /home/mcpuser /app 

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project 
COPY . .  
#USER mcpuser  

ENV PYTHONBUFFERED=1

ENTRYPOINT [ "uv", "run", "main.py" ] 
