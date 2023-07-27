<h1 align="center">
  <!-- <a href="https://<@TODO>" target="_blank"> -->
    <img alt="Certificate image" src="./public/assets/certificate.ico" width="400" />
  </a>
</h1>

# SHIFT certificates generation

Tool to generate students SHIFT certificates from PDF templates and student CSV file.

- [SHIFT certificates generation](#shift-certificates-generation)
  - [Requirements](#requirements)
  - [How to generate certificates](#how-to-generate-certificates)
    - [Local method (on your computer)](#local-method-on-your-computer)
      - [Method 1: use the app](#method-1-use-the-app)
      - [Method 2: use the CLI](#method-2-use-the-cli)
    - [Online method (remote server)](#online-method-remote-server)
  - [Contribute](#contribute)

## Requirements

To contribute to this project and run it locally, you will need:

- [Node JS >= v16.14 & NPM >= 8.5](https://nodejs.org/en)
- [Typescript >= 4.6.4](https://www.typescriptlang.org)

## How to generate certificates

### Local method (on your computer)

Clone the project & install dependencies:

```shell
  git clone https://github.com/NicolasMura/inseec-certificates.git
  cd inseec-certificates
  npm i
```

Copy your certificates templates into `templates` folder to reflect `CertificateTemplate` model in [`src/models/student.model.ts`](./src/models/student.model.ts) file:

- `templates/cerfa_13824-04.pdf`
- `templates/cerfa_13824-04.pdf`
- `templates/cerfa_13824-04.pdf`
- `templates/cerfa_13824-04.pdf`

Build and run the server locally:

```shell
  npm run build
  npm run start
```

#### Method 1: use the app

Open your favorite browser at `http://localhost:3000`, upload your student CSV file and click the `GENERATE CERTIFICATES` button:

@TODO un .gif pour illustrer

Wait for a few seconds and your certificates should now live in the `certificates` folder.

#### Method 2: use the CLI

Copy your student CSV file into `data` folder to match `generate-certificates` script in `package.json` file:

- `data/Liste étudiants SHIFT(s) B2 à certifier.csv`

Then open a new window in your terminal and run:

```shell
  npm run generate-certificates
```

Wait for a few seconds and your certificates should now live in the `certificates` folder.

> :bulb: **_Tip_**
>
> If the script crashes while generating certificates, you can try to reduce the `chunkSize` parameter in `src/middleware/create-pdf-certificates.ts` file.

### Online method (remote server)

@TODO
## Contribute

You should copy `.env.sample` to `.env` and then:

`npm run dev` - Run the development server.

`npm test` - Run tests.

`npm run test:watch` - Run tests when files update.

`npm run build` - Builds the server.

`npm start` - Runs the server.
