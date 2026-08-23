# Kitto — What It Is, In Simple English

> **What this document is for:** a full, non-technical explanation of Kitto. It covers the purpose,
> the features, the personality, the business model, and what is built today versus what is not.
> It is written to be given to someone (or to another AI) who will turn it into a presentation.
> The reader does not need to have seen the code or the app.
>
> **It is written in simple English on purpose.** Short sentences. Common words. No idioms.
> You can copy sentences from here straight onto a slide.

---

## 1. The one-sentence version

**Kitto is a life-management assistant. You tell it what is on your mind. You can say it, type it,
or point your camera at a paper. Kitto works out what you need to do, when you need to do it, and
which part of your life it belongs to. Then it makes sure you do not forget it.**

A longer version for a slide:

> Kitto is one place for everything you have to remember. Appointments. Bills. Renewals. Birthdays.
> Forms. Medicine. The car service. The thing you promised to do on Tuesday. You say it in your own
> words. Kitto saves it, gives it a date, and reminds you early enough to actually do something.

**The main job of the product is reminders you can trust.** Everything else helps that job. Reading
documents, chatting, and adding up costs all exist to make the reminders better.

---

## 2. The problem it solves

Running a life means keeping a hundred small jobs in your head. Not one big job. A hundred small
ones. Each one is easy. Together they are heavy.

Here is what they look like:

Book the dentist. Renew the car insurance. Mum's birthday. The school trip form. Cancel the free
trial before it charges you. Pick up the medicine. Service the air conditioner. Call the landlord
back. Pay the electricity bill. Renew the passport, which takes months. The vet appointment. The
form you must send back before a date printed in small text on page three.

These jobs are hard to manage for four reasons.

1. **They come to you at a bad time.** You remember them in the car, in the shower, in the middle of
   a conversation, or as you fall asleep. You are almost never sitting at a desk with an app open.
   By the time you could write it down, you have already moved on.
2. **Small jobs and big jobs feel the same in your head.** Forgetting the milk and forgetting your
   insurance take up the same space in your mind. Then one of them costs you a lot of money.
3. **They are stored in many places, so they are stored nowhere.** Some are in a calendar. Some are
   in a notes app. Some are in a drawer. Some are in an email. Most are only in your memory. There
   is no single place that holds everything. So the only way to feel safe is to keep worrying.
4. **Writing them down is work by itself.** Open the app. Type a title. Pick a category. Pick a date.
   Set a reminder. That is a full minute of work for something you thought about for two seconds.
   So most people do not do it. They try to remember instead. And that is the problem again.

The result is a quiet, constant stress: **you do not know what you have forgotten.**

### Some of it arrives on paper

Part of this load comes as documents. A renewal letter. A bill. A letter from the school. An
insurance policy.

This part is the hardest. The date is hidden deep inside the paper. The cost of missing it is
usually money. And after you read it, you still have to keep the paper somewhere you can find again.

We mention this for one reason: almost no other app can help with it at all. But it is only one part
of the problem. **Most of what Kitto handles never involves paper.**

### One normal month for one normal person

| Area of life | What is really on the list |
|---|---|
| **Health** | Dentist appointment, medicine refill, a check-up you keep delaying |
| **Home** | Rent, electricity bill, air conditioner service, the plumber you keep meaning to call |
| **Car** | Insurance renewal, service, safety test, a parking fine with a deadline |
| **Finance** | Tax filing, a subscription that renews on the 14th, a free trial about to charge |
| **Family** | School form, school fees, a birthday, someone's flight to collect |
| **Pets** | Vet visit, flea treatment, the pet food that runs out on Thursday |

None of these are difficult. All of them are easy to forget. That is the whole problem. Notice how
few of them involve paper.

### Who needs it most

- **Working adults** who carry their own load and have nobody to give it to.
- **Parents**, who carry the lives of two or three other people as well as their own. In most homes,
  one person carries most of this. It is often invisible work.
- **People in a busy period of life** — a new home, a new baby, a new job. The number of jobs goes
  up at exactly the time you have the least space to track them.
- **People living in a new country**, who face new systems, new deadlines, and often a second
  language in official letters.

---

## 3. What people already do, and where it stops

Nobody faces this problem with nothing. Everybody already has a system. The problem is that each
system is good at one part of the job and then stops.

**It starts with your own memory.** Free, instant, always with you. This is the real competitor, and
it works for years. Then one day it does not, and it fails without making a sound.

**So you add a list.** A notes app, or Todoist, or Apple Reminders. Now things are written down. But
you are doing all of the thinking. You type the title. You choose the area. You choose the date. And
you choose how early to be warned, which is the part that actually decides whether the reminder is
any use. The app does not know that car insurance needs a month of preparation and milk needs none.
It only knows what you told it. And the longer the list gets, the heavier it feels.

**Then you add a calendar**, because some things are real appointments. That works well for the
dentist at three o'clock. It works badly for everything else, because most life admin is not an
event. It is a period of time in which you have to act. A calendar can hold an appointment. It cannot
find one, chase one, or warn you a month early.

**And the papers go in a drawer**, because they have to go somewhere. The drawer keeps them safe and
does nothing else. Papers with deadlines, stored somewhere with no deadlines, is exactly how things
get forgotten.

### And then there is your phone assistant

This is the part that deserves respect, because it has become genuinely good.

Siri and Google Gemini understand normal speech now. You can say *"remind me to call the bank on
Tuesday at five"* and it is saved correctly, hands-free, in two seconds. Gemini can think, hold a
conversation, and save tasks for you. ChatGPT can set reminders too. This is not a toy any more, and
it solved the hardest part of the old problem: getting the words out of your head and into a system
before you forget them.

So the sentence goes in easily. Then what comes back is one alarm, at the exact moment you named.

And that is where it ends. The assistant did what you **said**. It has no opinion about what you
**meant**. It did not ask whether that moment was any use to you. It did not read the letter the
deadline came from. It does not hold the other fifty things you have to do, so it cannot tell you
that two of them collide, or that five of them land on the same Tuesday, or what all of them cost
you last month. And by next month, it has forgotten the conversation entirely.

That is the real gap, and it is easy to say in one line:

> **Capture is already solved. What comes after capture is not.**

Getting words into a system is the easy part, and every assistant now does it well. The hard part is
everything after: knowing how early to warn you, reading the paper the date came from, keeping
everything you have to do in one place, noticing when two of them collide, and being honest when it
is not sure.

That is where Kitto lives.

### The same story as a table

| Tool | What it genuinely does well | Where it stops |
|---|---|---|
| **Siri / Google Gemini** | Understands normal speech very well. Fast, hands-free, always available on the phone. Creates reminders and calendar events. Gemini can also reason and chat. | It does what you *said*, not what you *meant*. It has no opinion about whether the time you chose is useful. It does not read your documents into your life. It has no picture of everything you owe, so it cannot spot conflicts, duplicates, or totals. It forgets the context by next month. |
| **A to-do list app** (Todoist, Apple Reminders, Google Tasks) | Reliable, organised, good for lists you build yourself. Some now accept typed natural language. | You still do all the thinking: the title, the category, the date, and how early to be warned. It does not know that car insurance needs a month and milk needs nothing. And the longer the list gets, the worse you feel. |
| **A general AI chatbot** | Very good at explaining what a renewal is and how to do it. Can read a photo you upload and tell you what it says. | It has no idea when *your* renewal is. It cannot notify you. It cannot act at the right moment, and the right moment is the only one that matters. The answer sits in a chat you will never open again. |
| **A calendar** | Excellent for events at a fixed time, and for sharing them. | Most life admin is not an event. It is a period of time in which you must act. A calendar can hold an appointment. It cannot find one, chase one, or warn you a month early. |
| **A folder of documents** | Keeps the paper safe. | It stores. It does not act. Papers without deadlines are how things get forgotten. |
| **Your own memory** | Free, instant, always with you. This is the real competitor. | It works well until it does not, and it fails quietly. |

### One sentence, said to both

The clearest way to see the gap is to say the same ordinary sentence to an assistant and to Kitto.

> *"My car insurance ends on the 30th."*

**A normal assistant** creates a reminder for the 30th. On the 30th, your phone rings. That same day,
your insurance ends. You have no time left to compare prices, call anyone, or send documents. The
reminder was correct and useless.

**Kitto** does five more things:

1. It knows an insurance renewal needs about **a month** of preparation, so it warns you on the 1st,
   not the 30th.
2. It files it under **Car**, so it sits with everything else about your car.
3. It **checks it against everything else you have**, and tells you if that week is already full.
4. If you also scanned the letter, the **amount** goes into your money view, and the date shows the
   page it came from.
5. If it was not sure about the date, it **asks you** instead of guessing — and it still saves the
   job while it waits for your answer.

**The reminder is the same. The result is not.**

### The five things that make Kitto different

Each one of these is real and visible in the app.

**1. It knows what things are, not just what you said.**
An assistant treats "renew my passport" and "buy milk" as the same kind of sentence. Kitto knows one
needs six months of warning and the other needs none. This knowledge about real life admin is the
core of the product. Nobody gets a useful warning by accident.

**2. It turns paper into reminders.**
Take a photo of an insurance letter. Kitto reads the dates, the amounts, the policy number and the
names, creates the jobs, sets the warnings, stores the document, and links every date and amount to the
page it came from. A chatbot can read the same photo and tell you what it says. It will not put it
into your life and remind you at the right time.

**3. It sees the whole picture.**
Assistants save separate reminders that know nothing about each other. Kitto holds all of your jobs
in one place. Only then can it say: *"these two conflict"*, *"this looks like a duplicate"*,
*"five things are due on the 14th, spread them out"*, or *"your bills cost this much this month."*
A reminder on its own can never say any of that.

**4. You can check its work, and it asks when it is not sure.**
An assistant gives you a date and no way to check it. Kitto shows the exact page in your document
that the date was read from. And when a mistake would be expensive, it asks you a question instead
of guessing — while still saving the job, so nothing is lost. Trust is a feature here, not a
promise.

**5. Reminding is a plan, not one alarm.**
An assistant rings once. Kitto plans a series: an early warning, a middle check, a warning the day
before if it is urgent, the deadline itself, and then a few follow-ups if you miss it. Then it stops.
It also moves reminders out of the middle of the night. Ringing once at a time you chose while
distracted is not a system.

### What the assistants still have that Kitto does not

They are free. They are already installed. They are always listening, on every device, with no app to
open.

That is a real advantage and Kitto does not try to beat it. Kitto does not compete on how fast you
can say something. It competes on everything that happens afterwards. It is also happy to sit beside
them. Ask Siri for a timer. Ask Gemini a question. Give Kitto the things that have a deadline and a
consequence.

**So this is where Kitto sits:** it takes a job from *any* way you happened to think of it — a spoken
sentence, a chat message, a photo of a letter, a calendar you follow — and carries it all the way to
a reminder that arrives early enough to be useful, saved somewhere you can find it, in a system you
trust enough to stop carrying everything in your head.

---

## 4. How Kitto is meant to feel

This matters more than the feature list. Start the presentation here.

**The goal is relief, not productivity.**

Kitto does not try to make you faster. It does not give you points or streaks. It tries to make the
pile in the back of your mind quieter. The feeling we want is the moment you realise you do not have
to hold it all yourself any more.

Everything in the design comes from that idea:

- The home screen shows **one next thing**, not a long list. A list that only grows is a game you
  always lose.
- Kitto **never makes you feel guilty.** A late job is just a date that passed. No red warnings. No
  "you are falling behind."
- It **does not celebrate small actions.** Paying a bill does not deserve confetti. Finishing a
  whole day gets one warm moment, and that is all.
- It **takes stress away instead of adding it.** The tone is: "Rent is due tomorrow and you marked it
  urgent. Do you want it first today?" The tone is never: "3 OVERDUE TASKS!"

---

## 5. The five ways to put something into Kitto

Jobs come to you in many different ways. So there are five ways in. At least one of them will fit
the moment you remember something.

### 5.1 Say it — the main way

Tap the microphone. Say what is on your mind in a normal sentence. Tap save. That is all. You do not
wait for it to finish thinking.

> *"Dentist on Thursday at three, and I need to bring the referral letter."*
> *"Mum's birthday is on the 12th. Remind me a week before so I can send something."*
> *"The car insurance ends next month and I want to compare prices first."*
> *"Buy bread."*

Kitto works out how many separate jobs you said. It gives each one a sensible date. It puts each one
in the right area of your life. It sets the reminders. When it is done, you get a notification. You
never watch a loading circle.

Look at the last example. **Not everything needs a date, and Kitto knows this.** "Buy bread" is saved
as a simple list item. It never sends a notification. A reminder for bread is just noise. Kitto only
interrupts you when interrupting helps.

It understands English and Arabic, including sentences that mix both.

### 5.2 Scan it — for the part that comes on paper

For the part of your life that arrives as a document, using the camera is faster and safer than
reading it yourself. Point the camera at a bill, a letter, an insurance policy, a form, or a receipt.
You can also upload a PDF.

Kitto reads it. It reads the words, and it also understands the layout. Layout matters, because dates
and amounts usually sit inside boxes and tables, and their position gives them meaning. Kitto works
out what kind of document it is. It pulls out the dates, the amounts, the policy numbers, and the
names. Then it suggests jobs for you.

**Nothing is saved until you check it.** You see a review screen. Each suggested job shows how sure
Kitto is. The original document is one tap away, so you can compare any value with the page it came
from. You accept, edit, or delete each one.

### 5.3 Chat with it

There is an assistant you can type to or speak to. You can reach it from anywhere in the app.

> *"What is due this week?"*
> *"What do I have on Thursday?"*
> *"Move the dentist to next Tuesday."*
> *"Add: pick up the medicine."*
> *"Did I finish the school form?"*
> *"When does my car warranty end?"*

It can create, change, complete, delay, delete, and search your jobs. **Anything that deletes or
changes a lot needs your clear approval first.** It shows you a card and waits for you.

When the assistant answers using something you already saved, it shows you which item it used.

Your conversations are saved. You can rename them and delete them. Deleting a conversation never
deletes the jobs it created.

### 5.4 Type it yourself

The normal way. A simple form: title, date, area of life, priority, amount, notes, and small steps.
Nothing forces you to use the AI.

### 5.5 Follow calendars that already publish dates

- **Calendar links** — school terms, club schedules, sports fixtures. Many organisations
  publish these as public links. Kitto follows the link and turns the dates into your jobs.
- **Google Calendar and Google Tasks** — connect your account once, and what is there comes in.

---

## 6. What Kitto does with what you give it

### 6.1 It sorts everything into six areas of life

Every job goes into one of six areas: **Health, Home, Car, Finance, Family, or Pets.** This happens
automatically. You never choose from a menu.

Each area has its own colour and its own emoji badge. So when you look at a list, you know which part
of your life a row belongs to before you read the words.

If Kitto puts something in the wrong place, one tap fixes it.

There is also a **bulk clean-up**. You can ask Kitto to re-sort a group of jobs. It shows you a
before-and-after view of every change it wants to make. Nothing moves until you agree. This matters,
because you may have chosen some of those areas yourself. Changing your choices without asking is not
help.

### 6.2 It works out when to warn you, not just when it is due

This is one of the most important differences. It deserves its own slide.

Other reminder apps treat time as one moment. You save a date. They ring on that date. This does not
work for life admin, because **most life admin needs preparation time.** Telling you that your
passport expires today is not a reminder. It is too late.

Kitto chooses how early to warn you based on what the job actually is:

| Type of job | How early Kitto warns you |
|---|---|
| Passport renewal | About 6 months |
| Driving licence | About 2 months |
| Car registration or safety test | About 6 weeks |
| Insurance, warranties, policies | About 1 month |
| Subscriptions and memberships | About 3 weeks |
| Taxes and official filings | About 2 weeks |
| Bills, rent, electricity, water | About 5 days |
| Appointments (doctor, vet, interview) | About 1 day |

If Kitto does not recognise the exact job, it uses what is normal for that area of life. A car job
gets more warning time than a pet job.

There is more:

- **Priority changes how often it reminds you, not just how it looks.** A low-priority job gets one
  quiet reminder. An urgent job gets an early warning, a middle check, a warning one day before, and
  a reminder on the day itself.
- **Late notice is handled well.** Car insurance normally deserves a month of warning. But if you
  only tell Kitto six days before, it does not skip the warning. That is what a simple system would
  do. Kitto splits the remaining time and warns you at three days.
- **It will not wake you up at night.** A reminder that would arrive in the middle of the night is
  moved to a normal hour.
- **Late jobs get a few follow-ups, then stop.** A missed job follows up a small number of times,
  based on how important it is. Then it goes quiet and simply stays visible. It never becomes endless
  buzzing that you have to turn off.

### 6.3 It finds conflicts before you agree to them

Kitto checks if a new job conflicts with something you already have. There are two kinds:

- **A time conflict** — two things that cannot realistically both happen in that time.
- **A duplicate** — you already have this same job.

The important part: Kitto checks **before** anything is saved. And it does not only complain. It
offers you free times instead.

Those times are chosen to fit the *kind* of job. A film gets an evening. A dentist gets working
hours. Offering 9am for a cinema trip is not just unhelpful. It makes the assistant look like it was
not listening.

If you move a job on top of another one later, the conflict appears immediately, in the same place
you made the change.

### 6.4 It asks instead of guessing

This is the most important design decision in the product. Say it clearly in the presentation:

> **One wrong reminder loses the user's trust forever. Being right afterwards does not bring it
> back.**

So Kitto is honest about what it does not know. When something is unclear, it thinks about **how bad
it would be to get this wrong**:

- *"Buy bread"* — no date, nothing at risk. It just saves it. No question.
- *"Call the bank"* — no date, but a wrong guess costs nothing. It picks a sensible time **and tells
  you which time it picked.**
- *"Pay the fine"*, a flight, a court date, a passport — no date, and a wrong guess is expensive.
  Here it **asks you.** And it asks the question that decides the deadline: *"When is it due?"* It
  does not ask "when do you want a reminder?"

One rule holds this together: **asking never loses your job.** If Kitto asks you a question, the
thing you said is already saved. Only the *reminder* is held back. That way, a reminder can never
ring on an invented date.

Questions appear in two places. They appear as a small card in the chat where they came from. They
also collect in a **Questions** area, so you can answer them when you have time.

If there are three questions, you get one card that says "1 of 3" with progress dots. You never get
three separate alerts. You answer by tapping a suggested option, which is instant, or by typing a
reply. You can also delay a question for a week, or remove it.

There is a limit on how many open questions can collect. Kitto will never build you a second pile of
work out of its own uncertainty.

### 6.5 It shows where every answer came from

Every date and amount that Kitto read from a document shows the page it was read from. Tap it and
you see the original.

Amounts read from a document are marked as read from a document. Amounts you typed are not marked,
because you already know where they came from.

When Kitto is not sure about a value, it marks it clearly instead of showing it as a fact.

---

## 7. The screens, and what each one is for

### Home — "what needs me right now?"

This screen is not a list of everything. It refuses to show you everything on purpose.

- A warm greeting with your name and the time of day.
- **One job** — the next thing, shown large, with "Done" and "Not today" buttons right there.
- **Also today** — three more at most. Then a line like "4 more in Matters".
- A short note about how much time today needs.
- **Needs you** — a small strip for the three things that are waiting on you: guesses to confirm,
  scans to review, and jobs that are slipping.
- **A one-line summary of your day**, written by Kitto. Every number inside it is calculated from
  your real jobs, not invented by the AI.
- Quick buttons: Speak, Scan, Matters, Money.
- **Today's progress**, shown quietly as "3 of 5". Not as a trophy.

When your day is truly clear, it says so and tells you to rest. When your account is brand new, it
says something different. Telling a new user "you are all caught up" means nothing, because they have
nothing to catch up on.

### Matters — the full workspace

Everything you are tracking, with real tools for a list that grows:

- **Group** by time, by area, by priority, or not at all.
- **Filter** by status, area, priority, type, tags, and date range. There are presets like "this
  month" and "next month".
- **Sort** by date, by newest, by priority, or A–Z.
- **Search** in normal language, not only exact words.
- **Select many and act on all of them at once**, with an undo button.
- **Small steps** inside any job, each one tickable.
- **A trash** — deleted jobs can be restored until you empty it.
- **Delay** to later today, tomorrow, next week, or next month.
- Tap any row to open its full details.

### Summaries — "what is coming?"

Choose a period — this week, this month, next month. Kitto gives you a clear report, not a paragraph:

- How many are due, late, and done.
- Themes it noticed.
- Jobs that look duplicated.
- Jobs that keep getting delayed.
- Your busiest day: *"5 jobs land on the 14th. Do you want to spread them out?"*
- One useful question to think about.

**Every number is a link.** Tap "4 overdue" and the workspace filters to those four. A summary you
cannot open is only a claim.

Every number is calculated from your real data. The AI only names the themes and writes the question.
A number written by an AI is a good place for a confident mistake to hide.

### Money — what your admin costs

Your spending this month compared with last month. A trend over 3, 6, or 12 months. A breakdown by
area of life. What is still to pay. What is late. Your biggest items.

All of it is built from amounts Kitto read in your documents and amounts you typed. There is no bank
connection, no card access, and no financial advice.

**This one has its own section — see [§8, Money and cost analysis](#8-money-and-cost-analysis).**

### Documents — your storage

Everything you scanned. Sorted by type: bill, statement, letter, form, receipt, insurance, medical,
legal, identity, tax. Each document shows the jobs it created. You can select and delete many at
once. You can open the original at any time.

### Questions — the things Kitto is unsure about

The things Kitto did not want to guess. One card at a time. Each takes a few seconds to answer.

### Notifications

- A **bell** inside the app, with a list of everything that happened: reminders, questions, and
  finished scans. It shows a count of unread items.
- **Real phone notifications** on iPhone and Android. They have **"Done" and "Later today" buttons on
  the notification itself.** You can answer from the lock screen without opening the app.

### Profile and settings

- Your name, and what Kitto calls you.
- Email, confirmed with a six-digit code typed into the app. A link is not used, because links do not
  work well inside apps.
- Password.
- **Time zone**, so reminders and your daily summary arrive on the correct day when you travel.
- **Signed-in devices** — see every device and sign the others out.
- **Reminder permissions**, including a warning when your phone settings are blocking them.
- **Language** — English or Arabic.
- **Appearance** — light or dark.
- **Connected calendars** — the calendars you follow, with a clear message when one stops working.
- **Google** — your connected account.
- **Export your data** — everything Kitto holds, as a file, any time you want.
- **Delete your account** — fully, and your session ends immediately.

### First time you open it

Five short questions, one at a time:

1. What should I call you?
2. What weighs on you most? (renewals and bills / appointments / documents / family and school)
3. How full is your week? (packed / steady / light)
4. How should I speak to you? (briefly / with detail)
5. Which areas should I watch?

Then: *"I'll keep your file in order, [name]."*

---

## 8. Money and cost analysis

Life admin is not only a set of dates. It is also a set of **amounts**. Those amounts sit in the same
places the dates do. A number on page two of a policy. A total at the bottom of a bill. A fee
mentioned once in a school letter.

Nobody adds them up. So nobody knows what their admin costs until the money is gone.

Kitto adds them up, because it was already reading those documents anyway.

### Where the numbers come from

Two sources only:

1. **Amounts Kitto read in your documents.** Every scanned bill, invoice, policy, and receipt is
   checked for an amount at the same time as the dates.
2. **Amounts you typed yourself** on a job.

There is **no bank connection, no card access, and nothing imported from a bank.** Kitto only sees
money that was written on a document you gave it, or a number you typed.

This limit is deliberate, and it is worth saying out loud. It keeps the feature honest. It keeps it
safe. And it means the analysis is about *your admin*, not about your whole financial life.

### The questions it answers

| Question | The answer |
|---|---|
| **What did this month cost me?** | One big number at the top: what you spent this month. |
| **Is that a lot?** | Up or down compared with last month, as a percentage and an amount. |
| **Where did it go?** | A breakdown across the six areas of life. You can see that Car is taking a third of it. |
| **What is the trend?** | Month by month, over 3, 6, or 12 months. |
| **What do I still owe?** | "Still to pay" shows amounts with a future date. Late amounts are shown separately. |
| **What are the big ones?** | Your largest items in the period. |

Every row is a link. Tap an amount and you go to the job it belongs to, or to the original document
the number came from.

### Many currencies, handled honestly

This detail makes the feature stand out. It is a good slide.

**Kitto never adds two currencies together.** The product has no exchange rate source. So a combined
total could only be invented. And an invented number looks exactly as confident as a real one.

If you have Egyptian and American documents, you get two complete pictures. The busiest currency
comes first. Each one is correct on its own. The page says it clearly: *"Currencies are reported
separately. No exchange rate is applied."*

The maths inside each currency is correct too. Not every currency divides by 100. Japanese yen has no
decimal places. Kuwaiti dinar has three. Getting this wrong would show ¥1,000 as ¥10. That is a wrong
number that looks completely trustworthy. Kitto uses the real rule for each currency.

### It tells you what it could not see

The most important line on the money screen is the one that admits its own limits:

> *"Read from 8 of 12 documents. Anything paid outside Kitto is not counted."*

The totals come from documents where an amount was actually found. Showing the totals without this
note would claim to describe "your spending" while ignoring money the app never saw. So the note sits
on the page as a normal sentence, not hidden behind a small icon.

Kitto also separates two situations that look the same in a simple app:

- *"You have no documents."*
- *"You have forty documents and none of them had a readable amount."*

These need different words, because they need different actions.

In the same way, **refunds are shown next to your spending. They are never quietly subtracted.** A
large refund cannot hide a large month.

### Small details that keep it honest

Mention these if the audience likes careful work. The same thinking runs through the whole product.

- **No comparison is shown unless there is a real month to compare with.** "Up 100% from last month"
  when last month had no data is just maths, not information. It is also the kind of claim that makes
  people stop trusting every other number on the page.
- **Months with no spending are drawn as empty bars, not skipped.** A chart that hides its empty
  months puts two separated months next to each other and shows a trend that did not happen.
- **Documents that were never given an area are left out of the area breakdown.** They are not put
  into an "Other" group, because "Other" would look like a real category.
- **Every amount Kitto read is marked as read.** If a number the AI found looks the same as a number
  you typed, you have no way to know which one to check. And one wrong number you trusted damages
  every number after it.

### Typing an amount yourself

Any job can carry an amount. The number and the currency are **two separate fields**. They are never
read from one box.

"480 EGP" in a single box means guessing where the number ends. Guessing wrong about money is exactly
the failure this feature exists to prevent. Any world currency is accepted. The most likely ones are
suggested.

Amounts also survive the voice path. If you say what something costs, that number reaches the saved
job. It is not heard and then lost.

### On the home screen

There is a small money card on the home screen. It carries two facts and a link: what you spent this
month, and whether anything is unpaid or late.

The card **does not appear at all until there is a real number to show.** A card showing "0" on a new
account teaches you that the feature is empty, instead of teaching you that it is waiting for data.

### What this is not

Say this clearly, because a smart audience will ask:

- It is **not a budgeting app.** No budgets, no targets, no "you spent too much on food."
- It is **not financial advice.** Kitto never tells you to change provider. It never compares prices.
  It never recommends a product.
- It is **not connected to your money.** No bank, no cards, no balances.

It is **an analysis of what your bills and renewals cost.** It comes free from documents Kitto was
already reading. And it answers the same question the whole product answers: *what is coming, and
what will it take?*

---

## 9. Kitto's personality

Kitto is a small ghost who handles your admin. The voice is **warm and genuinely capable at the same
time.** Cute, but not silly. Friendly, but never over-friendly.

The rules the writing follows:

- **Short and warm beats long and polite.** "Added it — Tuesday at 9." "That's three for today."
- **Never start with a compliment.** Start with the answer.
- **A small nod, not a party.** A finished job gets one warm line: "Done — that's Health clear for
  today." Then it moves on.
- **Calm punctuation.** One emoji at most, and usually none. Exclamation marks are rare.
- **Errors are simple and kind.** "That document didn't load. Try again?" Never an error code. Never
  fake cheerfulness.
- **Buttons say what they do.** "Create matter", "Attach document", "Resolve". Never "Submit" or
  "OK".
- **It says "matters", not "tasks".** A task is a chore. A matter is something that matters.

### How it looks

The style is soft on purpose. The internal description is *"a planner that hugs you."*

- An almost-white background with a light purple tone. Pure white cards float on top with a very soft
  shadow and no hard borders.
- **Nothing is sharp.** Every corner is either a full circle shape or a wide, round corner.
- A serif font for the big moments — greetings, dates, large numbers. A round, friendly font for
  everything else. The contrast between those two fonts *is* the brand.
- One coral colour, and it always means the same thing: **live.** Active, recording, in progress.
- The signature mark: **an emoji inside a pastel circle** for each area of life. It looks the same in
  light mode and dark mode, because this is the one place where colour carries meaning.
- Gradients are used in only four emotional moments: welcome, first setup, celebration, and the AI
  preview.
- Movement is used to explain, never to entertain. Panels grow out of the button you tapped and
  shrink back into it, so you never lose your place. Everything respects the phone's
  "reduce motion" setting.
- Light mode and dark mode are both designed properly. Dark mode is not just a dimmer light mode.

---

## 10. Languages, and why it is a real advantage

Kitto works **fully in English and in Arabic**, including complete right-to-left layout. It is not a
half translation with English still showing. It is not a mirrored layout with broken spacing.

This matters for three reasons. Put them on a slide.

1. The Arabic-speaking market is large, and Western productivity apps serve it badly.
2. Life admin is exactly where a second language hurts most. Official letters, renewal notices, and
   government forms are the hardest documents to read in a language that is not your first. They are
   also the ones where mistakes cost the most.
3. It is genuinely hard to build well. Most competing products do not do it.

The AI reads Arabic documents and Arabic speech, and it replies in Arabic.

---

## 11. Where Kitto runs

One product, three places:

- **In a web browser** — the full app.
- **On iPhone** — a real app from the App Store.
- **On Android** — a real app from the Play Store.

The phone versions are not a website with missing features. They use the real camera, the real
microphone (including recording while the screen is off), and real system notifications with buttons
on the lock screen.

---

## 12. How it is built, in simple words

This is enough to answer questions without showing a technical diagram.

- **One AI model does all three jobs: reading documents, understanding speech, and chatting.** The
  model is Google's Gemini 2.5 Flash. The reason is specific. Kitto sends it audio, PDFs, and photos,
  not only text. A text-only model would need a separate speech service and a separate document
  service. Each one adds cost and new ways to fail. And normal document scanning throws away the
  *layout* of the page. Layout is exactly where dates and amounts live.
- **The AI is asked for structured answers, not paragraphs.** It fills a fixed shape: title, date,
  area, priority, confidence. That shape is checked before anything is saved. The AI is never asked
  to write text that a program then has to guess the meaning of.
- **The AI cannot act on its own.** It suggests actions. The app checks every one of them. Anything
  that deletes or changes a lot stops and asks you first.
- **Your documents and your data stay yours.** Kitto only sees what you give it. It does not read
  your email. It does not browse your cloud storage. Wherever there was a choice between wide access
  and narrow access, the narrow one was chosen. That is a stronger privacy promise, and it also
  happens to be cheaper to run.
- **The app can be paused safely.** If an AI feature has to be switched off, the app knows, and the
  button says "paused". You do not record a message that then fails.
- **An honest limit, stated on purpose:** the best document reading available today is about 90–94%
  accurate on clean documents. Kitto does not claim 99%. Instead, every date and amount shows the
  page it came from, and anything unclear becomes a question instead of a reminder. *A named limit
  with a real solution is stronger than a claim of perfection.*

---

## 13. What is built, and what is not

Being honest here is a strength. Technical people in the room will assume there are gaps anyway.

**Working today:**

- **The reminder engine** — warning times matched to the type of job, more reminders for urgent
  items, follow-ups for late items that stop after a few tries, and phone notifications with buttons
  on the lock screen
- Voice capture into jobs, in English and Arabic, including several jobs in one sentence, and items
  with no date that never ring
- The chat assistant, with confirmations and sources
- Automatic sorting into the six areas, plus a reviewable bulk re-sort
- Document scanning into jobs, with dates, amounts, and details, reviewed before saving
- The questions system for things Kitto is unsure about
- Conflict and duplicate detection, with suggested free times
- Daily summary and period summaries
- Money analysis: monthly spending and comparison, 3/6/12-month trend, breakdown by area, still to
  pay and late, largest items, separate currencies, and a coverage note
- Full workspace: search, filters, grouping, bulk actions, trash, small steps
- Document storage
- Following calendar links, and Google connection
- Full account management, data export, account deletion
- English and Arabic with right-to-left, light and dark mode
- Web, iPhone, and Android

**Not built yet — say this openly:**

- **Payments.** There is no checkout. Everyone is on the free level right now. The upgrade screen
  honestly says "Pro isn't open yet." Selling is work that still has to be done. It is not a decision
  that was made and hidden.
- **Family or household sharing.** There is no second person on an account yet. This is real work to
  build, not a small change.
- **Asking questions about your documents.** Kitto reads documents to find jobs. But you cannot yet
  ask *"what does my car insurance say about windscreen cover?"* The document text is not searchable
  that way yet. It is designed and planned.
- **Learning from you over time.** The reminder timings follow fixed rules today. Adapting them to
  how *you* behave — how long you really take, when you really respond — is the next planned layer.
  It needs real usage data that does not exist before launch.

---

## 14. The business model, in simple terms

### The plan

| Level | What you get | Price |
|---|---|---|
| **Free, forever** | The app without AI: manual jobs, reminders, document storage, full export | Free |
| **Trial** | Everything, for 7 days | Free |
| **Kitto Plus** | The AI: scanning, voice, chat, daily summary, auto-sorting, unlimited documents | About $8.99/month or $59/year |
| **Top-ups** | Optional, only if you use far more than normal | For example, importing a large box of old documents |

### Why it is shaped this way

- **The free level costs almost nothing to run**, because it does not use the AI. So free users can
  keep their data forever. That is important, because "your documents are safe here" is the promise
  the product depends on. And it is not expensive for us.
- **You pay for a capability, not for a number of questions.** Charging per AI message means the
  limit never affects normal users and only punishes heavy users. Charging for the capability is
  clearer and more honest.
- **The yearly price is the headline. The monthly price is the comparison.** Same product, very
  different feeling.
- **Regional pricing is on**, so the app store adjusts the price by country automatically. About
  $8.99 in the US becomes a few dollars in Egypt. This serves both markets without hurting either.
- **There is a hidden fair-use limit**, set at 5 to 10 times normal usage. About 95% of users never
  reach it. It protects us from extreme cost without making anyone watch a credit balance go down.
  Watching a balance drop is the opposite of the calm this product sells.
- **No lifetime deal.** AI has ongoing costs. A one-time payment against an ongoing cost ends in
  broken promises or cancelled accounts. Other AI products have already learned this publicly.

### Other ways to earn money that were considered

1. **Setup service** — "send me your documents and I will set up your storage and your renewal
   calendar, $99." This needs no code. It brings money in days. And it answers the most important
   question a new product has: who has this problem badly enough to pay?
2. **Through companies** — insurance brokers, financial advisers, employee benefit programmes. Every
   similar document product ended up being sold this way, because reaching individual customers is
   expensive and these companies already have the relationship.
3. **Renewal referrals, with a strict rule.** Kitto knows when your policies renew. That information
   is valuable in the insurance market. The rule taken here is that this may **only** happen if the
   user presses a "get me a quote" button themselves. It must never happen quietly in the background.
   Doing it quietly would break the trust the product depends on. Similar products deliberately
   refuse to do it.

---

## 15. What makes it hard to copy

- **There is no extra work for the user.** The priority, the warning time, the area, the conflict check
  — all of it comes from the same sentence or photo you were going to give anyway. The app gets
  smarter without asking you for more.
- **It gets better the longer you use it.** The planned learning layer adjusts to how *you* behave.
  That advantage grows with time and cannot be copied by a competitor starting from zero.
- **It sits in a real gap in the market.** Smart calendar scheduling (Reclaim, Motion) and simple AI
  capture (Todoist AI, Apple Reminders) are two separate categories today. Joining them at the
  reminder level is not something either side can do without changing their whole product.
- **The big assistants are built the wrong way round for this.** Siri and Gemini are general tools.
  They serve every request equally, so they cannot hold deep knowledge about one narrow area like
  life admin. Knowing that a passport needs six months and a bill needs five days is not a feature
  they would add — it is a whole product. They also work one request at a time, with no lasting
  picture of everything you owe, which is exactly what conflict detection and cost totals need. Being
  narrow is the advantage here, and a general assistant cannot become narrow.
- **Trust is built into the design, not claimed in marketing.** Every date shows the page it came
  from. Asking instead of guessing. Nothing destructive without confirmation. These are structural
  decisions.
- **The money analysis costs nothing extra to produce.** Kitto already reads the documents to find
  the dates, so it gets the amounts for free. It can answer "what is my admin costing me?" without
  asking for a bank connection. A reminder app cannot answer that question. A budgeting app can only
  answer it by taking access to your accounts.
- **Arabic and right-to-left, done properly**, in the exact area where a language barrier does the
  most damage.

---

## 16. A suggested order for the presentation

1. **Start with the feeling, not the product.** The stress of not knowing what you forgot. Ask the
   room to think about everything they personally must deal with in the next month. Let the silence
   sit for a second. Everyone in the room already has this problem.
2. **Show the pile.** One normal month across the six areas of life on one slide: dentist, insurance,
   school form, birthday, vet, bill. Say out loud how few involve paper. This is a memory problem,
   not a filing problem.
3. **Handle the assistants properly. Do not dismiss them.** Say clearly that Siri and Gemini are
   good and that they understand speech well. Then say the real line: **capture is already solved;
   what happens after capture is not.** Follow it immediately with the car insurance example — the
   same sentence, said to both, and the two different results. This is the strongest slide in the
   deck, because it answers the question the reviewer is already thinking.
4. **Say the one-sentence version of Kitto.**
5. **Show the main loop live if you can.** Say one normal sentence: *"Dentist Thursday at three, and
   Mum's birthday on the 12th."* Two jobs appear, sorted into Health and Family, with dates and
   reminders. **This is the product.** Then show the second way in: photograph a letter, review it,
   confirm, done. The document is the impressive part. The spoken sentence is the everyday part.
6. **Show the trust system.** Tap a date and see the page it came from. Then show Kitto *asking* a
   question instead of guessing on something expensive. Say the line out loud: *one wrong reminder
   loses trust forever.*
7. **Show the reminder intelligence.** The warning-time table works well here. This is the moment the
   audience understands this is not a to-do list with a microphone attached.
8. **Show one conflict being caught, and a free time being offered.**
9. **Show the money screen.** The same documents that gave the dates also gave the amounts. So Kitto
   can answer "what is my admin costing me?" for free. Point at the coverage line while you do it.
   The app tells you what it *could not* see. That one sentence makes every other number believable.
10. **Switch the app to Arabic on stage.** The whole interface flips. It is memorable and it takes
    three seconds.
11. **Be honest about the limits.** Document reading is 90–94% accurate on clean documents, and here
    is the designed answer to that. Payments are not open yet. This earns more trust than it costs.
12. **Finish with the business model**, then return to the feeling: order, restored.

### Short lines that work well on a slide

- *"You speak a sentence. Kitto does the rest."*
- *"Order, restored."*
- *"A hundred small things. None of them hard. All of them easy to forget."*
- *"Stop keeping it all in your head."*
- *"Capture is already solved. What happens after capture is not."*
- *"Siri reminds you on the 30th. Your insurance ends on the 30th. Kitto warns you on the 1st."*
- *"An assistant does what you said. Kitto does what you meant."*
- *"One alarm is not a system."*
- *"One wrong reminder loses trust forever."*
- *"Other apps tell you your passport expired today. That is not a reminder. That is too late."*
- *"Kitto asks instead of guessing. And asking never loses your item."*
- *"It reads your bills for the dates. The amounts come free."*
- *"No exchange rate is applied, because we would have to invent one."*
- *"The goal is relief, not productivity."*
- *"Say it and I'll file it."*

---

## 17. The words Kitto uses

Keep these consistent in the presentation. The product is careful about its words.

| Word | What it means |
|---|---|
| **Matter** | Anything Kitto is tracking for you. Not "task", on purpose. A task is a chore. A matter is something that matters. |
| **Area** / **domain** | One of the six parts of life: Health, Home, Car, Finance, Family, Pets. |
| **Reminder** | A matter that has a date and will notify you. |
| **List item** | A matter with no date. It sits on a list and never notifies you. |
| **Question** / **uncertainty** | Something Kitto was not confident enough to guess. It is waiting for your answer. |
| **Brief** | The one-line summary of your day on the home screen. |
| **Slipping** | A matter that passed its date and was not handled. Never called "failed". |
| **Still to pay** | Amounts with a date that has not arrived yet. Different from late, which is shown separately. |
| **Coverage** | Kitto's statement of how much of your spending it could actually see. "Read from 8 of 12 documents." |
| **Extracted** / **read from a document** | The mark on any number or date the AI found, as opposed to one you typed. |
| **Kitto** | The ghost. The assistant. The product. |

---

## 18. Background for the presenter

- **Project:** ITI Graduation Project, 2026.
- **Team of six:** Mina Melad, Mahmoud Ahmed, Fady Adel, Omar Abdullah, Omar Khaled, Mario Magdy.
- **The product was rebuilt once.** The first version was a native mobile app. The tools caused most
  of the problems, so it was rebuilt with web technology that still ships to both app stores. It kept
  the native features that actually matter: real notifications and background recording. Mention this
  if the audience is technical. The decision was made for development speed, and it worked.
- **The build is ahead of the documentation, not behind it.** Most student projects show a strong
  idea with a thin product. Kitto is the opposite. So the presentation should spend its time
  *showing*, not explaining.
