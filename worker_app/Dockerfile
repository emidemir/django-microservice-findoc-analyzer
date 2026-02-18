FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# For linux things...
# Deletes the package manager's cache after installing the tools.
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/

# For python things
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the application code into the image
COPY . /app/

# EXPOSE is for readability and tells the reader, what ports are being exposed from 
# running your image. Again, it's strictly for readability purposes and doesn't actually
# do anything, but it's still a really good idea to have it.
EXPOSE 8000

# Will be executed only when you run container without specifying a command
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]