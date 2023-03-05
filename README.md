# Karasu

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=karasu&style=for-the-badge&logo=true)

<br />
<br />

[![forthebadge](https://forthebadge.com/images/badges/uses-badges.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/powered-by-black-magic.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/it-works-why.svg)](https://forthebadge.com)

## Clickup Wiki

Certain important things are written on our [Clickup wiki](https://app.clickup.com/42080348/docs), like how to fetch data with supabase, or how to use our custom draggable components. Clickup is no longer used an an issue tracker, see the [project tracking](#project-tracking) section below.

If you're creating a new page, please try to adhere to these rules:

- Use the default font. Don't write it in some wierd serif font.
- Articles should be simple and to the point. Roundabout explanations using the MLA format waste peoples time.
- Explain with code. Rather than trying to describe the way smth works in a long paragraphh, try to lean on code examples as much as possible, while using writing to add context.

## Project Tracking

We use github project for project tracking

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

You can view brandons unfinished style guide [here](https://app.clickup.com/42080348/v/dc/18462w-160/18462w-300)
