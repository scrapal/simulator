import { action, makeAutoObservable, observable } from "mobx";

interface IShape {
  x: number;
  y: number;
}

class Shape implements IShape {
  @observable x: number;
  @observable y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Rectangle extends Shape {
  @observable width: number;
  @observable height: number;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
  }
}

export class Circle extends Shape {
  @observable radius: number;

  constructor(x: number, y: number, radius: number) {
    super(x, y);
    this.radius = radius;
  }
}

export interface IExperiment {
  id: number;
  shapes: Shape[];
  name: string;
  addShape: (shape: Shape) => void;
  removeShape: (shape: Shape) => void;
}

export class Experiment {
  @observable id: number = Math.random();
  @observable name: string = "New Experiment";
  @observable shapes: Shape[] = [];

  constructor(name: string) {
    makeAutoObservable(this);
    this.name = name;
    this.shapes.push(new Rectangle(Math.random() * 100 + 100, 50, 100, 100));
    this.shapes.push(new Circle(100, 100, 50));
  }

  @action addShape(shape: Shape) {
    this.shapes.push(shape);
  }

  @action removeShape(shape: Shape) {
    const index = this.shapes.indexOf(shape);
    if (index > -1) {
      this.shapes.splice(index, 1);
    }
  }
}

export interface IStore {
  experiments: Experiment[];
  currentExperiment: Experiment | null;
  addExperiment: (experiment: Experiment) => void;
  removeExperiment: (experiment: Experiment) => void;
  setCurrentExperiment: (experiment: Experiment) => void;
}

export class Store {
  @observable experiments: Experiment[] = [];
  @observable currentExperiment: Experiment | null = null;

  constructor() {
    makeAutoObservable(this);
    this.experiments.push(new Experiment("Experiment 1"));
    this.experiments.push(new Experiment("Experiment 2"));
    this.currentExperiment = this.experiments[0];
  }

  @action addExperiment(experiment: Experiment) {
    this.experiments.push(experiment);
  }

  @action removeExperiment(experiment: Experiment) {
    const index = this.experiments.indexOf(experiment);
    if (index > -1) {
      this.experiments.splice(index, 1);
    }
    if (this.currentExperiment === experiment) {
      if (index - 1 >= 0 && index - 1 < this.experiments.length) {
        this.currentExperiment = this.experiments[index - 1];
      } else {
        this.currentExperiment = this.experiments[0];
      }
    }
  }

  @action setCurrentExperiment(experiment: Experiment) {
    this.currentExperiment = experiment;
  }
}

const store = new Store();

export default store;
