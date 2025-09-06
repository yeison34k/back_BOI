# Comandos cURL para API de National Filing Corporation

## Configuración Base
```bash
BASE_URL="http://localhost:3000"
```

## Reporting Company Endpoints

### 1. Crear Empresa Reportante (POST)
```bash
curl -X POST "$BASE_URL/api/reporting-companies" \
  -H "Content-Type: application/json" \
  -d '{
    "companyLegalName": "Test Company LLC",
    "alternateName": "Test Corp",
    "companyPhone": "+1-555-123-4567",
    "address": {
      "street": "123 Main Street",
      "city": "Wilmington",
      "state": "Delaware",
      "zipCode": "19801"
    },
    "taxInformation": {
      "taxIdentificationType": "EIN",
      "taxIdentificationNumber": "123456789",
      "countryJurisdiction": "United States"
    },
    "stateOfIncorporation": "Delaware"
  }'
```

### 2. Obtener Todas las Empresas (GET)
```bash
curl -X GET "$BASE_URL/api/reporting-companies"
```

### 3. Obtener Empresa por ID (GET)
```bash
# Reemplazar {id} con el ID real de la empresa
curl -X GET "$BASE_URL/api/reporting-companies/{id}"
```

### 4. Actualizar Empresa (PUT)
```bash
# Reemplazar {id} con el ID real de la empresa
curl -X PUT "$BASE_URL/api/reporting-companies/{id}" \
  -H "Content-Type: application/json" \
  -d '{
    "companyLegalName": "Updated Company Name LLC",
    "companyPhone": "+1-555-987-6543",
    "address": {
      "street": "456 Updated Street",
      "city": "New York",
      "state": "New York",
      "zipCode": "10001"
    }
  }'
```

### 5. Eliminar Empresa (DELETE)
```bash
# Reemplazar {id} con el ID real de la empresa
curl -X DELETE "$BASE_URL/api/reporting-companies/{id}"
```

## Beneficial Owner Endpoints

### 1. Crear Beneficiario Efectivo (POST)
```bash
curl -X POST "$BASE_URL/api/beneficial-owners" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "middleName": "Michael",
    "lastName": "Doe",
    "dateOfBirth": "1980-01-15",
    "residenceLocation": "inside",
    "country": "United States",
    "street": "456 Oak Avenue",
    "city": "New York",
    "stateProvidence": "New York",
    "zipPostalCode": "10001",
    "identifyingDocumentType": "passport",
    "identifyingDocumentNumber": "A12345678",
    "issuingJurisdiction": "United States",
    "jurisdictionStateProvidence": "New York",
    "photoId": "base64encodedphoto",
    "certificationAccepted": true,
    "serviceTermsAccepted": true,
    "electronicSignature": "John Michael Doe",
    "reportingCompanyId": "COMPANY_ID_HERE",
    "isActive": true
  }'
```

### 2. Obtener Todos los Beneficiarios (GET)
```bash
curl -X GET "$BASE_URL/api/beneficial-owners"
```

### 3. Obtener Beneficiario por ID (GET)
```bash
# Reemplazar {id} con el ID real del beneficiario
curl -X GET "$BASE_URL/api/beneficial-owners/{id}"
```

### 4. Obtener Beneficiarios por Empresa (GET)
```bash
# Reemplazar {companyId} con el ID real de la empresa
curl -X GET "$BASE_URL/api/beneficial-owners/company/{companyId}"
```

### 5. Actualizar Beneficiario (PUT)
```bash
# Reemplazar {id} con el ID real del beneficiario
curl -X PUT "$BASE_URL/api/beneficial-owners/{id}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "city": "Los Angeles",
    "stateProvidence": "California"
  }'
```

### 6. Eliminar Beneficiario (Soft Delete)
```bash
# Reemplazar {id} con el ID real del beneficiario
curl -X DELETE "$BASE_URL/api/beneficial-owners/{id}"
```

### 7. Eliminar Beneficiario Permanentemente
```bash
# Reemplazar {id} con el ID real del beneficiario
curl -X DELETE "$BASE_URL/api/beneficial-owners/{id}/permanent"
```

## Ejemplos de Uso Completo

### Flujo Completo: Crear Empresa y Beneficiario

1. **Crear empresa y guardar ID:**
```bash
COMPANY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/reporting-companies" \
  -H "Content-Type: application/json" \
  -d '{
    "companyLegalName": "Example Corp LLC",
    "alternateName": "Example Corp",
    "companyPhone": "+1-555-000-1234",
    "address": {
      "street": "789 Business Ave",
      "city": "Miami",
      "state": "Florida",
      "zipCode": "33101"
    },
    "taxInformation": {
      "taxIdentificationType": "EIN",
      "taxIdentificationNumber": "987654321",
      "countryJurisdiction": "United States"
    },
    "stateOfIncorporation": "Florida"
  }')

COMPANY_ID=$(echo $COMPANY_RESPONSE | jq -r '.id')
echo "Company ID: $COMPANY_ID"
```

2. **Crear beneficiario usando el ID de la empresa:**
```bash
curl -X POST "$BASE_URL/api/beneficial-owners" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Maria\",
    \"lastName\": \"Garcia\",
    \"dateOfBirth\": \"1975-05-20\",
    \"residenceLocation\": \"inside\",
    \"country\": \"United States\",
    \"street\": \"321 Residential St\",
    \"city\": \"Miami\",
    \"stateProvidence\": \"Florida\",
    \"zipPostalCode\": \"33102\",
    \"identifyingDocumentType\": \"license\",
    \"identifyingDocumentNumber\": \"D123456789\",
    \"issuingJurisdiction\": \"United States\",
    \"jurisdictionStateProvidence\": \"Florida\",
    \"photoId\": \"base64encodedphoto\",
    \"certificationAccepted\": true,
    \"serviceTermsAccepted\": true,
    \"electronicSignature\": \"Maria Garcia\",
    \"reportingCompanyId\": \"$COMPANY_ID\",
    \"isActive\": true
  }"
```

## Notas Importantes

1. **Reemplazar IDs:** Los comandos que contienen `{id}`, `{companyId}`, etc., deben reemplazarse con IDs reales obtenidos de respuestas anteriores.

2. **Validaciones:** Todos los endpoints tienen validaciones estrictas. Asegúrate de que:
   - Los teléfonos sigan el formato internacional
   - Los códigos postales sean válidos (formato 12345 o 12345-6789)
   - Las fechas estén en formato ISO (YYYY-MM-DD)
   - Los campos booleanos sean `true` o `false`

3. **Campos Requeridos:**
   - **Empresa:** companyLegalName, companyPhone, address (completa), taxInformation (completa), stateOfIncorporation
   - **Beneficiario:** firstName, lastName, dateOfBirth, residenceLocation, country, address completa, documento de identificación, certificaciones, firma electrónica, reportingCompanyId

4. **Respuestas:** Todas las respuestas exitosas incluyen:
   - `success`: boolean
   - `data`: objeto o array con los datos
   - `total`: número total de registros (en listados)
   - `page`, `pages`: información de paginación (en listados)

5. **Códigos de Estado:**
   - 200: Éxito (GET, PUT, DELETE)
   - 201: Creado exitosamente (POST)
   - 400: Error de validación
   - 404: Recurso no encontrado
   - 500: Error interno del servidor