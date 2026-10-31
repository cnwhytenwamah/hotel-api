# Hotel API Module Architecture

Every business module should follow this structure:

```text
module-name/
├── controllers/
│   └── module.controller.ts
│
├── services/
│   └── module.service.ts
│
├── repositories/
│   └── module.repository.ts
│
├── models/
│   └── module.model.ts
│
├── dto/
│   └── module.dto.ts
│
├── validators/
│   └── module.validator.ts
│
└── routes/
    └── module.routes.ts