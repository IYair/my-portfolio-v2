#!/bin/bash

# Script para generar un NEXTAUTH_SECRET seguro
echo "Generating a secure NEXTAUTH_SECRET..."
echo ""

# Generar un secreto usando openssl
SECRET=$(openssl rand -base64 32)

echo "NEXTAUTH_SECRET=\"$SECRET\""
echo ""
echo "Copy this to your .env file and/or Vercel environment variables!"
echo "Make sure to replace the existing NEXTAUTH_SECRET value."