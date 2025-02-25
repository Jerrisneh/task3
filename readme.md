Objective
Build a simple web page builder that allows users to dynamically create, edit, and delete
elements on a webpage using a form.


Functional Requirements
1. Initial UI
○ On page load, there should be a single button at the bottom right:
■ A plus button (+) with text below it: "Add New Element".

2. Adding an Element
○ Clicking the Add New Element button opens a form with the following fields:
■ Element Type (Required) – e.g., div, p, h1, button, etc.
■ Width (Required) – CSS-compatible value (e.g., px, %, em).
■ Height (Required) – CSS-compatible value.
■ Text (Required) – Content of the element.
■ Text Color (Required) – CSS color (hex, RGB, named colors, etc.).
■ Background Color (Required) – CSS color.
■ Display (Optional) – block, inline, flex, grid, etc.
■ Alignment (Optional) – text-align (left, center, right, justify).
■ Border (Optional) – CSS border property.
■ Other CSS Properties (Optional) – Input fields for additional key-value
CSS pairs.
○ When submitted, a new element should be created on the page with the specified
properties.
○ Whenever an element is created, local storage must be updated to reflect the
new state of the page.
○ When the page is reloaded, everything in local storage should be used to
rebuild the page exactly as it was before.

3. Positioning Rules
○ Each created element must have an edit pencil icon at its top right.
○ No element’s edit icon should be covered by another element.
○ If a newly created element would overlap an existing edit icon, the program
should automatically move the new element down by at least 20 pixels to ensure
the icon remains visible.
○ If this happens, an alert should inform the user: "Element was moved down to
prevent overlap."

4. Editing an Element
○ Clicking the edit pencil icon opens an update form pre-filled with the element’s
current properties.
○ The element becomes editable, and a delete button appears.
○ The form should allow modifying any of the properties.
○ The form should also include Cancel and Save buttons:
■ Cancel: Closes the form without applying changes.
■ Save: Updates the element with new properties and updates local
storage to save the changes.

5. Deleting an Element
○ While in edit mode, a delete button is visible.
○ Clicking it removes the element from the page and updates local storage to
reflect the deletion.
Bonus feature
- Add an undo feature for any element that has been deleted. When an element is
deleted, show an “undo delete” button with a countdown timer. The countdown should count
down from 5 to 0, after which, the undo delete button goes away and it’s no longer possible to
undo a deletion