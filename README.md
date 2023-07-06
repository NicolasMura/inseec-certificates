<h1 align="center">
  <!-- <a href="https://<@TODO>" target="_blank"> -->
    <img alt="Certificate image" src="./public/assets/certificate.ico" width="400" />
  </a>
</h1>

# SHIFT certificates generation

Tool to generate students SHIFT certificates from templates.

- [SHIFT certificates generation](#shift-certificates-generation)
  - [Requirements](#requirements)
  - [How to generate certificates](#how-to-generate-certificates)
  - [Contribute](#contribute)

## Requirements

To contribute to this project and run it locally, you will need:

- [Node JS >= v16.14 & NPM >= 8.5](https://nodejs.org/en)
- [Typescript >= 4.6.4](https://www.typescriptlang.org)

## How to generate certificates

Clone the project & install dependencies:

```shell
  git clone https://github.com/NicolasMura/inseec-certificates.git
  cd inseec-certificates
  npm i
```

Copy your certificates templates in `templates` folder to reflect `CertificateTemplate` model in [`src/models/student.model.ts`](./src/models/student.model.ts) file:

- `templates/cerfa_13824-04.pdf`
- `templates/cerfa_13824-04.pdf`
- `templates/cerfa_13824-04.pdf`
- `templates/cerfa_13824-04.pdf`

Build and run the server locally:

```shell
  npm run build
  npm run start
```

Open your favorite browser at `http://localhost:3000`, upload your student CSV file and click the `GENERATE CERTIFICATES` button:

@TODO un .gif pour illustrer

Wait for a few minutes and your certificates should now live in the `certificates` folder.

## Contribute

You should copy `.env.sample` to `.env` and then:

`npm run dev` - Run the development server.

`npm test` - Run tests.

`npm run test:watch` - Run tests when files update.

`npm run build` - Builds the server.

`npm start` - Runs the server.
