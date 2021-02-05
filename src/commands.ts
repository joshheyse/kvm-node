export type Command = {
  write(): string;
};

export const ListInfoCommand: Command = {
  write(): string {
    return 'K1P0';
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
