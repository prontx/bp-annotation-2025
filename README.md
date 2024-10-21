# Audio recording transcription & annotation platform 
Author: Matsvei Hauryliuk
Code inherited from `https://github.com/Dugowitch/annotation-user-interface/tree/main`

## Prerequisites
- Node.js: ^20.12.0
- yarn: ^1.22.21

## Running the Development Server
- Install dependencies (only for the first time):
```
yarn -i
```
- Insert your `API_KEY` to the `app.config.ts` file
- Start the development server:
```
yarn dev
```

## Transcribing a recording:
- Create an account at `https://www.spokendata.com/api`
- Upload a recording to the API
- Append `/?job_id={JOB_ID}` to the running script, where `{JOB_ID}` is the `id`  field of the recording 
in the API.

