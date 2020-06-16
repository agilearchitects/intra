export default {
  title: "AAI",
  menu: {
    start: "Start",
    wiki: "Wiki",
    time: {
      time: "Tidsrapportering",
      report: "Rapportera",
      result: "Resultat",
      project: "Projekt",
    },
    crm: "CRM",
    "cv": "CV",
    login: "Logga in",
    logout: "Logga ut",
  },
  wiki: {
    wiki: "Wiki",
    agile_architects: {
      agile_architects: "Agile Architects",
      mentality: "Mentalitet",
      communication: "Kommunikation",
      transparency: "Öppenhet",
    },
    board: {
      board: "Styrelsen",
      members: "Medlemmar",
      aoa: "Bolagsordning",
    },
    accounting: {
      accounting: "Bokföring",
      bokio: "Bokio",
      expenses: "Utlägg",
      purchase: "Inköp",
    },
    channels: {
      channels: "Kanaler",
      email: "E-post",
      chat: "Chat",
      files: "Filer",
    },
    staff: {
      staff: "Personal",
      onboarding: "Onboarding",
      offboarding: "Offboarding",
    },
    development: {
      development: "Utveckling",
      git: "GIT",
      devops: "DevOps",
      scrum: "Scrum",
      documentation: "Dokumentation",
    },
  },
  login: {
    login: "@:menu.login",
    email: "E-postadress",
    password: "Lösenord",
    submit: "Logga in",
    forgot_password: "Glömt lösenord?",
  },
  password_reset: {
    text: "Fyll i e-postadress för användare du vill återställa lösenord för.",
    password_reset: "Återställ lösenord",
    submit: "Återställ",
    success: "Länk för att återställa ditt lösenord har skickats till {email}",
  },
  contact: {
    header: "Kontakta oss",
    label: {
      email: "E-post:",
      phone: "Tel:",
      on_facebook: "@:title på facebook",
    },
    address: "Storgatan 40",
    zip: "12345",
    city: "Stockholm",
    email: "support@test.test",
    phone: "073 - 692 50 13",
  },
  customer: {
    customer: "Kund",
    name: "Namn",
    select: "Välj @:customer.customer",
    create: {
      header: "Lägg till ny kund",
      error: {
        header: "@:error.header",
        message: "Gick inte att skapa kund. Var god försök igen"
      }
    }

  },
  project: {
    project: "Projekt",
    select: "Välj @:project.project",
    create: {
      error: {
        header: "@:error.header",
        message: "Gick inte att skapa projekt. Var god försök igen"
      }
    },
    update: {
      error: {
        header: "@:error.header",
        message: "Gick inte att uppdatera projekt. Var god försök igen"
      }
    }
  },
  task: {
    task: "Uppgift",
    select: "Välj @:task.task",
  },
  user: {
    user: "Användare",
    select: "Välj @:user.user",
  },
  time: {
    time: "Tidrapport",
    form: {
      header: {
        add: "Lägg till ny @:time.time",
        edit: "Redigera @:time.time",
      },
    },
    customer: "@:customer.customer",
    project: "@:project.project",
    task: "@:task.task",
    from: "Från",
    to: "Till",
    tag: "Taggar",
    comment: "Kommentar",
    stop: {
      error: {
        header: "@:error.header",
        message: "Timer gick inte att stoppa. Var god försök igen"
      }
    },
    create: {
      error: {
        header: "@:error.header",
        message: "Gick inte att skapa tidrapport. Var god försök igen"
      }
    },
    update: {
      error: {
        header: "@:error.header",
        message: "Gick inte att uppdatera tidrapport. Var god försök igen"
      }
    }

  },
  text: {
    update: {
      success: {
        header: "Text uppdaterad!",
        message: "Text har uppdaterats"
      }
    }
  },
  empty_list: "Inga val i lista",
  auth: {
    error: {
      login: "Failed to login"
    }
  },
  api: {
    error: {
      missing_header: "API base URL was missing from header",
    }
  },
  error: {
    header: "Error"
  }
};
