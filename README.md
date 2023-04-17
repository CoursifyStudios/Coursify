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
  <img src="https://forthebadge.com/images/badges/built-with-grammas-recipe.svg" height=35 >
  <img src="https://hhrehffmdrcjqowwvgqg.supabase.co/storage/v1/object/public/cdn/assets/Coursify/for-students-by-students.svg">
  <img src="https://forthebadge.com/images/badges/works-on-my-machine.svg" height=35>

</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#setup">Setup</a> •
  <a href="#styling">Styling</a> •
  <a href="#tracking">Tracking</a> •
  <a href="#wiki">Wiki</a> •
  <a href="#credits">Credits</a>
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

1. Download the [Supabase CLI](https://supabase.com/docs/guides/cli#installation) and [Docker](https://www.docker.com/products/docker-desktop/)

2. Log into supabase by running `supabase login` or if installed by npm `npx supabase login`

3. Run `supabase start`. This might take a while, especilly if it's your first time running it. (You can use `supabase stop` to stop the docker container). Next, run `yarn slink` to link to the Coursify project. **Ask Lukas for the password**

4. Visit the [dashboard](http://localhost:54323)

## Styling

While there aren't currently any style or brand guidelines, we do have a few rules to keep in mind when styling components/pages for Coursify.

- For **primary backgrounds** use `gray-200` and in the event gray on gray use `gray-300`
  - If you need more grays, you're doing something wrong.
- All pages should use `max-w-screen-xl` and have borders with `px-4 md:px-8 xl:px-0`
- For creating labels, use the [Pill](https://github.com/CoursifyStudios/karasu/blob/main/components/misc/pill.tsx#L5-L32) component.
- For styling buttons there are two options:
  - For regular buttons use the [Button](https://github.com/CoursifyStudios/karasu/blob/main/components/misc/button.tsx#L5-L13) component.
  - For icons use the [Button Icon](https://github.com/CoursifyStudios/karasu/blob/main/components/misc/button.tsx#L23-L45) component.
  - In the event that a fake button is required, to add accessibility by screen readers and keyboard navigation, add `tabIndex={0}`.
- For tooltips the user can copy, use the [Copied Hover](https://github.com/CoursifyStudios/karasu/blob/main/components/misc/pill.tsx#L34-L72) component.

### Examples

**Pill with CopedHover**

```jsx
<CopiedHover copy={window.location.href}>
	<ButtonIcon icon={<LinkIcon className="h-5 w-5" />} />
</CopiedHover>
```

## Tracking

### Features

We use [github projects](https://github.com/orgs/CoursifyStudios/projects/5/views/2) for overall feature tracking. This means that if you are working something or have a feature idea, it should be there.

Certain pages in development may have feature specific tracking which can be found [here](https://github.com/orgs/CoursifyStudios/projects).

### Bugs

When you find a bug be sure to [report it](https://github.com/CoursifyStudios/Coursify/issues/new) by creating a new issue tagged as a "bug". Be sure to include as many useful details as possible such as screenshots, steps for recreation if necessary, intended behavior, etc. When fixing bugs, be sure to link the original issue to the pull request.

## Wiki

Certain important things are written on our [Clickup wiki](https://app.clickup.com/42080348/docs), like how to fetch data with supabase, or how to use our custom draggable components.

If you're creating a new page, please try to adhere to these rules:

- Use the default font. Don't write it in some weird serif font.
- Articles should be simple and to the point. Roundabout explanations using the MLA format waste peoples time.
- Explain with code. Rather than trying to describe the way something works in a long paragraph, try to lean on code examples as much as possible, while using writing to add context and reasoning.

## Credits

The Coursify Studios core team consists of:

- [Blocksnmore](https://github.com/Blocksnmore)
- [brandnholl](https://github.com/brandnholl)
- [IllGive](https://github.com/IllGive)
- [quick007](https://github.com/quick007)

Coursify uses the following open source packages:

- [React](https://react.dev/)
- [NextJS](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Lexical](https://lexical.dev/)
- [HeroIcons](https://heroicons.com/)
- [HeadlessUI](https://headlessui.com/)

.. and many more.
