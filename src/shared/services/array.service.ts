type relation = "1to1" | "1toM" | "MtoM";
interface IAnnotation {
  name: string;
  primaryKey: string;
  relation: relation;
}

export class ArrayService {
  public rotate<T>(input: any, key: string): T[] {
    const annotations: IAnnotation[] = key.split(".").map((annotation: string) => {
      const match = annotation.match(/^([a-zA-Z0-9]+)(?:\(([a-zA-Z0-9]+)\)|)(?:\:(1to1|1toM|MtoM)|)$/);
      if (match === null) {
        return {
          name: annotation,
          primaryKey: "id",
          relation: "1toM"
        };
      }
      return {
        name: match[1],
        primaryKey: match[2] || "id",
        relation: (match[3] || "1toM") as relation,
      }
    });

    input = { [annotations[0].name]: input };

    const returnValue: T[] = [];
    for (const value of input) {
      for (const annotation of annotations) {
        //
      }
    }
    return returnValue;
  }

  public dotAnnotation(input: any, dotAnnotation: string): any {
    const annotations = dotAnnotation.split(".");
    let returnValue: any = input[annotations.splice(1, 0)[0]];
    for (const annotation of annotations) {
      if (returnValue[annotation] !== undefined) {
        returnValue = returnValue[annotation];
      } else {
        return undefined;
      }
    }
  }
}

const foo: any = [
  {
    id: 1,
    name: "My customer",
    projects: [
      {
        id: 1,
        name: "My Project",
        tasks: [
          { id: 1, name: "Meeting" },
          { id: 2, name: "Development" }
        ]
      },
      { id: 2, name: "My Second Project", tasks: [] }
    ],
    city: { id: 1, name: "Stockholm" },
    users: [
      { id: 1, name: "John" },
      { id: 2, name: "Mary" }
    ]
  },
  {
    id: 2,
    name: "Another Customer",
    projects: [
      { id: 3, name: "Project 1", tasks: [{ id: 3, name: "Meeting" }] },
      { id: 4, name: "Project 2", tasks: [] }
    ],
    city: { id: 1, name: "Stockholm" },
    users: [
      { id: 1, name: "John" }
    ]
  }
]
