<h1 align="center">
  <br>
  <a href="https://coursify.dev" target="_blank"><img src="https://cdn.discordapp.com/attachments/1018976233884749917/1095927183001796628/logo.png" alt="Coursify" width="200"></a>
  <br>
Coursify
  <br>
</h1>

<h4 align="center">A next generation <a href="https://en.wikipedia.org/wiki/Learning_management_system">learning management system</a></h4>

<p align="center" >
  <img src="https://forthebadge.com/images/badges/it-works-why.svg">
  <img src="https://forthebadge.com/images/featured/featured-built-with-love.svg" height=35 >
  <img src="https://forthebadge.com/images/badges/made-with-typescript.svg">
  <img src="https://forthebadge.com/images/badges/powered-by-comcast.svg">
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#setup">Setup</a> •
  <a href="#Styling">Styling</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

![Coursify](https://cdn.discordapp.com/attachments/984948771198746725/1095847122630361300/Previewprojectpreview.png)

## Features

- Integrated Tabs - Stay in your tab and streamline your workflow
  - Pages within Coursify automatically open up within our internal tab system.
- Accurate Schedule
  - Schedules automatically take into account the school schedule and class type to show your personal schedule and reduce confusion.
- Rich Assignment Types
  - Support for multiple different assignment types including link submissions, checkboxes, and google media.
- Centralized Assignment Page
  - Never lose track of your tasks - find and sort your assignments in one place.
- Sleek and simple design
- Advanced Search
- [Rich Text Editor](https://github.com/CoursifyStudios/Dawn)
- OAuth 2.0 Login using Google
- Dark/Light mode

## Setup

### Web Interface

To clone and run this application, you'll need [Git](https://git-scm.com) and [Yarn](https://classic.yarnpkg.com/en/) installed on your computer. After cloning the repo locally in your IDE, from your command line:

```bash
# Install dependencies
$ yarn

# Run the app
$ yarn dev
```

Next, create a `.env.local` file and populate it with the following variables

```
NEXT_PUBLIC_SUPABASE_URL=https://cdn.coursify.one
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhocmVoZmZtZHJjanFvd3d2Z3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc1MjEyNjgsImV4cCI6MTk4MzA5NzI2OH0.f2YZkZDHL_E81DbpgnwloXUHQ9n7aCW4DF_VNMDcuqM
```

### Supabase

## Styling

## Credits

This software uses the following open source packages:

- [Electron](http://electron.atom.io/)
- [Node.js](https://nodejs.org/)
- [Marked - a markdown parser](https://github.com/chjj/marked)
- [showdown](http://showdownjs.github.io/showdown/)
- [CodeMirror](http://codemirror.net/)
- Emojis are taken from [here](https://github.com/arvida/emoji-cheat-sheet.com)
- [highlight.js](https://highlightjs.org/)

# Courisfy

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=karasu&style=for-the-badge&logo=true)

<br />

![For students by students badge](https://img.shields.io/badge/FOR%20STUDENTS-BY%20STUDENTS-blueviolet?style=for-the-badge)

<br />

[![forthebadge](https://forthebadge.com/images/badges/uses-badges.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/powered-by-black-magic.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/it-works-why.svg)](https://forthebadge.com) ![Powered by green check marks badge](https://img.shields.io/badge/MADE%20POSSIBLE%20BY-12%20DOLLAR%20GREEN%20CHECKMARKS-brightgreen?style=for-the-badge)

## Setting up Supabase Locally

1. Download the [Supabase CLI](https://supabase.com/docs/guides/cli#installation) and [Docker](https://www.docker.com/products/docker-desktop/)

2. Log into supabase by running `supabase login`

3. Run `supabase start`. This might take a while, esspecilly if it's your first time running it. (You can use `supabase stop` to stop the docker container). Nesxt, run `yarn slink` to link to the Coursify project. **Ask Lukas for the password**

4. Visit the [dashboard](http://localhost:54323)

## Clickup Wiki

Certain important things are written on our [Clickup wiki](https://app.clickup.com/42080348/docs), like how to fetch data with supabase, or how to use our custom draggable components. Clickup is no longer used as an issue tracker, please see the [project tracking](#project-tracking) section below.

If you're creating a new page, please try to adhere to these rules:

- Use the default font. Don't write it in some weird serif font.
- Articles should be simple and to the point. Roundabout explanations using the MLA format waste peoples time.
- Explain with code. Rather than trying to describe the way something works in a long paragraph, try to lean on code examples as much as possible, while using writing to add context and reasoning.

## Project Tracking

We use [github projects](https://github.com/orgs/CoursifyStudios/projects/5/views/2) for project tracking. This means that if you are working something or have a feature idea, it should be there.
Suggestions for new setttings on the settings page should not go on the primary project tracking sheet, and should instead go on the [settings suggestions](https://github.com/orgs/CoursifyStudios/projects/6/views/1) sheet.

## Style Guide:

- Use gray 200 for backgrounds when you need a gray. For gray on gray, use gray 300. If you need a gray on top of a gray on top of a gray, you're doing something wrong.
- For labels, use the [Pill](https://github.com/CoursifyStudios/karasu/blob/main/components/misc/pill.tsx#L5-L32) component.
- For buttons, use the [Button](https://github.com/CoursifyStudios/karasu/blob/main/components/misc/button.tsx#L5-L13) component, or the [ButtonIcon](https://github.com/CoursifyStudios/karasu/blob/main/components/misc/button.tsx#L23-L45) component for using an icon as a button
  - If for whatever reason you make a fake button that is not accessible by screen readers and keyboard navigation, add tabIndex={0}.
- If you need a tooltip the user can copy, use the [CopiedHover](https://github.com/CoursifyStudios/karasu/blob/main/components/misc/pill.tsx#L34-L72) component. A tooltip component is coming soon.
- Pages should use `max-w-screen-xl` and have borders like this: `px-4 md:px-8 xl:px-0`

### Examples:

_Some of these can be combined/used in other ways_

**Pill with CopedHover**

```jsx
<CopiedHover copy={window.location.href}>
	<ButtonIcon icon={<LinkIcon className="h-5 w-5" />} />
</CopiedHover>
```

You can view Brandon's unfinished style guide [here](https://app.clickup.com/42080348/v/dc/18462w-160/18462w-300)
