# Refleksion – Figma til kode

**Navn:** Julie Svan

---

## Eksempel 1: Container Query

### Hvor og hvorfor?

Jeg har brugt en `@container` query på Case Studies-siden til `.case-details`, som er den bjælke med case-information, der ligger under billedet.

Formålet var at gøre komponenten responsiv på mindre skærme. På større skærme er indholdet opdelt i to kolonner, mens det under 800px ændres til én kolonne, og indholdet centreres, så det også fungerer bedre visuelt.

Der er brugt `@container` frem for en almindelig `@media` query, fordi komponenten skal reagere på den plads, den selv har til rådighed, og ikke nødvendigvis på hele viewportens bredde.

`src/pages/case-studies/[slug].astro`

### Relevant kode

```css
@container (width < 800px) {
  .case-story-article header .case-details {
    bottom: -18rem;
  }

  .case-details {
    grid-template-columns: 1fr;

    dl {
      flex-direction: column;
      row-gap: 1rem;
      margin-inline: auto;
    }

    .button {
      width: 100%;
      grid-column: 1;
      margin-inline: auto;
    }
  }
}
```

Med `@container` ændres layoutet, når `.case-details` ikke længere har plads nok til at vise indholdet i to kolonner.
`grid-template-columns: 1fr` får derfor indholdet til at stå i én kolonne, mens `flex-direction: column` rykker informationerne i `dl` ind så de står over hinanden.

### Afprøvning og ændringer

Jeg afprøvede komponenten ved at ændre CSS'en og kontrollere layoutet på forskellige skærmstørrelser i browseren.
På mindre skærme blev indholdet for tæt, når `.case-details` stadig var opdelt i to kolonner. Ved at ændre layoutet til én kolonne blev indholdet mere overskueligt.

`.case-details` er også et eksempel på Defensive CSS, da jeg forsøger at forebygge at indholdet bliver klemt på små skærme. Havde jeg haft mere tid, ville jeg have forsøgt at forbedre layoutet, og gøre det mere robust.

## Eksempel 2: Popover API & Anchor Positioning

### Hvor og hvorfor?

Jeg har brugt Popover API til login-panelet, så panelet kan åbnes og lukkes uden at skulle skrive JavaScript til selve interaktionen. Det gør løsningen enklere og lader browseren håndtere popover-funktionaliteten. Jeg har kombineret det med Anchor Positioning, så login-panelet kan placeres i forhold til login-knappen i stedet for at skulle beregne positionen med JavaScript.

`src/components/Header.astro`

### Relevant kode

```css
[popovertarget] {
  anchor-name: --login-btn;
}

[popover] {
  --arrow-size: 0.6rem;
  position-area: bottom;
  margin: 0.6rem;
  border: none;

  background-color: var(--color-surface-secondary);
  padding: 1.5rem;
  border-radius: 20px;
}

&::before {
  content: "";
  position: fixed;
  width: calc(var(--arrow-size) \* 1.667);
  height: var(--arrow-size);
  background: inherit;
  clip-path: polygon(0 100%, 50% 0, 100% 100%);
  position-anchor: --login-btn;
  position-area: bottom;
}
&::backdrop {
  background: rgba(0, 0, 0, 0.2);
}
```

`anchor-name` giver login-knappen navnet `--login-btn`, som derefter bruges af popoveren gennem `position-anchor`.
`position-area: bottom` placerer popoveren under login-knappen. På denne måde kan placeringen håndteres af CSS uden JavaScript.

### Afprøvning og ændringer

Jeg testede, at login-panelet kunne åbnes fra login-knappen, og at det blev placeret korrekt under knappen. Jeg tog udgangspunkt i noterne om Popover API og Anchor Positioning fra de fælles noter til temaet, og med hjælp fra disse fungerede login-panelet uden nogle komplikationer.

Næste skridt ville være at gøre den bevægelig. Det nåede jeg ikke at kigge på, da jeg valgte at prioritere min tid på nogle af de andre teknikker og krav til opgaven.

## Eksempel 3: --flow-space

### Hvor og hvorfor?

Jeg har brugt --flow-space til at skabe en mere ensartet vertikal rytme mellem elementer med tekst på siden. I stedet for at sætte individuelle margins på alle overskrifter, afsnit og andre elementer bruger jeg en fælles --flow-space-regel og ændrer kun værdien, når en bestemt relation har brug for mere eller mindre afstand.

`src/styles/tokens.css`

### Relevant kode

Mine spacing-tokens:

--flow-space: 1rlh;

--flow-space-s: 0.5rlh;

--flow-space-l: 1.5rlh;

--flow-space-section: 2rlh;

--flow-space er min generelle spacing-token, og så har jeg brugt de andre til at ændre spacing-forhold mellem bl.a. headings og p-elementer. Jeg har fx brugt --flow-space-s til spacing mellem en heading og et p-element, da de er nært beslægtet, og dermed skal have en tæt relation.
Det gjorde det lettere at få en ensartet rytme gennem sitet.

På Case Studies-undersiden bruger jeg fx:

```css
.case-story-content > * + * {
  margin-block-start: var(--flow-space);
}

.case-story-content h2 + p {
  --flow-space: var(--flow-space-s);
}

.case-story-content li + li {
  margin-block-start: var(--flow-space-l);
}
```

### Afprøvning og ændringer

Jeg er blevet opmærksom på, at brugen af –-flow-space kræver at man bruger tid på at skabe et velfungerende system, og der kunne nok også have været flere tokens med andre værdier. Fremover er det noget jeg vil prioritere at opbygge tidligere i processen, da det også gør det lettere at være konsekvent gennem hele sitet, og undgå fejl.

## Ekstra forbedring: Relative Color Syntax

Som ekstra forbedring har jeg brugt Relative Color Syntax til hover-state på de gule knapper. I stedet for at oprette en separat farve til hover tager jeg udgangspunkt i mit eksisterende `--color-action`-token og ændrer kun værdien for lightness.

Først havde jeg problemer med, at knappen blev helt usynlig ved hover. Det skyldtes at jeg havde skrevet "10%" i stedet for "10", da jeg troede, det skulle være i procent. Efter denne rettelse fungerede hover-funktionen.

```css
button:hover {
  background-color: hsl(from var(--color-action) h s calc(l + 10));
}
```

## Fallback og robusthed

- **Fallback/progressive enhancement:**

Jeg har FAQ-komponenten som eksempel på progressive enhancement. FAQ'en er bygget med details og summary, så den grundlæggende funktionalitet ikke afhænger af CSS-animationer.

Til animationen bruger jeg interpolate-size, men kun hvis browseren understøtter denne feature, idet jeg har benyttet @supports():

Jeg har testet i Chrome [Version 152] og Safari [Version 26.2].

I Chrome fungerer det, så her vil brugeren opleve en glidende overgang, når der åbnes og lukkes for et svar.

Det virker endnu ikke i Safari. Derfor vil brugere af Safari stadig kunne benytte FAQ'en, da det ikke ændrer funktionaliteten, men udelukkende drejer sig om det visuelle i form af animationen. Når der åbnes og lukkes et svar i FAQ'en vil der i stedet for en glidende animation åbnes og lukkes brat.

```css
@supports (interpolate-size: allow-keywords) {
  @media (prefers-reduced-motion: no-preference) {
    interpolate-size: allow-keywords;

    &::details-content {
      block-size: 0;
      overflow: clip;
      transition:
        block-size 0.3s ease,
        content-visibility 0.3s;
      transition-behavior: allow-discrete;
    }

    &:open::details-content {
      block-size: auto;
    }
  }
}
```

MDN: [interpolate-size](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interpolate-size)

Noter fra undervisning: [interpolate-size](https://demos.cssxs.dev/topic/3sem/crafting-ui/ui-animation/accordion-og-interpolate-size)

- **Global CSS og komponent-CSS:**

Jeg har udvidet `tokens.css` med flere genbrugelige værdier til bl.a, spacing og typografi, så de kan bruges på tværs af hele sitet.
Den specifikke styling af komponenterne ligger derimod lokalt i de enkelte Astro-komponenter. Det gør det lettere at se, hvilken styling der hører til hvilken komponent, og mindsker risikoen for, at ændringer ét sted påvirker andre dele af sitet.

Jeg synes, det var mere overskueligt at dele det meste af indholdet op i separate komponenter, selvom det primært bruges til indhold, der går igen, som fx header og footer.

I `global.css` har jeg stylet bl.a. headings og img-elementer med de generelle properties og values, der går igen på alle pågældende elementer.

- **Tastaturbetjening:**

Jeg testede om siden fungerede med tastaturbetjening ved at navigere rundt med Tab, hvilket den gør.
Jeg testede blandt andet navigationen, login-popoveren, knapper og FAQ'en, og gennem hele sitet følger tastaturbetjeningen en naturlig rækkefølge fra top til bund.
FAQ'en kunne åbnes og lukkes med tastaturet, og knapperne fungerede ved Enter.

## Brug af AI

Jeg har brugt AI som sparringspartner gennem projektet, især til fejlfinding og rådgivning.

Der har også været situationer, hvor AI's forslag ikke virkede eller ikke var den bedste løsning.
I de tilfælde har jeg testet videre, fundet fejlen og valgt en anden løsning.

Et eksempel var arbejdet med spacing i case-details, hvor AI foreslog en række løsninger på et CSS-problem, der ikke ændrede resultatet.
Den misforstod mine prompts og den stump kode, jeg havde sendt.

Det omhandlede min container query til .case-details, hvor jeg forsøgte at ændre afstanden mellem elementerne på små skærme. Jeg fik selv løst problemet ved at bruge `column-gap` og `row-gap`.

AI har derfor primært fungeret som et forklarings- og fejlfindingsværktøj, og til at få en bedre forståelse af de teknikker, der indgår i opgaven.

## Kilder

MDN: [Vejledning](https://developer.mozilla.org/en-US/)

Can I Use: [Browserunderstøttelse](https://caniuse.com/)

Noter fra undervisning: [Vejledning](https://demos.cssxs.dev/topic/crafting-ui)

ChatGPT Study Mode: [Rådgivning og fejlfinding](https://chatgpt.com/)
