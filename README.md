# Signit
# Signit - Document Signing Application

Signit is an Angular application that allows users to sign PDF and image documents with their signatures. Users can upload a single document or a folder of documents, and sign them all with a signature which can be either uploaded as an image or drawn directly in the application.

## Features

- Upload and sign multiple documents at once
- Upload signature as an image or draw it directly in the application
- Choose signature position (top center or bottom center)
- Embedded signatures in PDF documents using PDF-Lib
- Image overlay signatures for image documents
- Preview documents before and after signing
- Download signed documents individually or all at once
- Specify a location to save signed documents
- Multilingual support with reactive language switching (English and Hebrew)
- Full RTL (Right-to-Left) layout support for Hebrew

## Technologies Used

- Angular 20.0.0
- TypeScript 5.8.2
- RxJS 7.8.0
- PDF-Lib 1.17.1 (for PDF manipulation and signing)

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 7.x)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

- `/src/app/components` - Reusable components (file upload, signature upload)
- `/src/app/pages` - Page components (home, sign document, sign folder, result)
- `/src/app/services` - Services (document service)
- `/src/app/models` - Data models (document, signature)

## Usage

1. From the home page, click on the Sign Documents option
2. Upload your documents
3. Add your signature by either uploading an image or drawing it
4. Click the sign button to process the document(s)
5. Download the signed document(s) or specify a location to save them

## Future Enhancements

- Add more options for signature positioning (custom x,y coordinates)
- Implement document zoom and pan for better preview
- Add user authentication and document storage
- Support for more document formats
- Add document encryption for security
- Batch processing improvements for large document sets
- Integration with cloud storage services

## License

MIT License
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
