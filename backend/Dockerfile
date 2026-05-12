FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    python3-dev \
    libjpeg-dev \
    zlib1g-dev \
    libpng-dev \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install --no-cache-dir \
    "Django==5.1.0" \
    "djangorestframework==3.15.2" \
    "djangorestframework-simplejwt[crypto]==5.3.1" \
    "django-cors-headers==4.4.0" \
    "psycopg2-binary" \
    "python-decouple==3.8" \
    "whitenoise==6.7.0" \
    "gunicorn==22.0.0" \
    "dj-database-url==2.2.0" \
    "Pillow==10.4.0" \
    "django-filter==24.3" \
    "drf-spectacular==0.27.2" \
    "django-storages==1.14.3" \
    "boto3==1.35.0" \
    "celery==5.4.0" \
    "redis==5.0.8" \
    "django-redis==5.4.0" \
    "stripe==10.7.0" \
    "drf-nested-routers==0.94.1" \
    "sentry-sdk[django]==2.12.0"

EXPOSE 8000

CMD ["sh", "-c", "gunicorn ecommerce.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120"]
