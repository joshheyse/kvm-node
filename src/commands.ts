export type Command = {
  write(): string;
};

export const ResetBuffer: Command = {
  write(): string {
    return '\n\n\n';
  },
};

export const ListInfoCommand: Command = {
  write(): string {
    return 'k1p0';
  },
};

export function ChangePort(channel: 1 | 2 | 3 | 4): Command {
  return {
    write(): string {
      return `CH${channel}`;
    },
  };
}

export function SetBuzzer(on: boolean): Command {
  return {
    write(): string {
      return on ? 'buzzon' : 'buzzoff';
    },
  };
}
