import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit"
import { homeworks } from "../data/homeworks.js";

export default function InteractiveTerminal() {
    const terminalRef = useRef(null);
    const isTerminalInit = useRef(false);

    useEffect(() => {
        if (terminalRef.current && !isTerminalInit.current) {
            isTerminalInit.current = true;

            const term = new Terminal({
                cursorBlink: true,
                fontFamily: "monospace",
                theme: {
                    background: "#000000",
                    foreground: "#22c55e",
                    cursor: "#22c55e",
                    selectionBackground: '#ffffff',
                    selectionForeground: '#000000'
                },
            });

            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);

            term.open(terminalRef.current);
            fitAddon.fit();

            term.writeln("Type 'help' to see available commands.");
            term.write("❯ ");

            let currentCommand = "";

            term.onKey(({ key, domEvent }) => {
                const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

                if (domEvent.key === 'Enter') {
                    term.writeln("");
                    if (currentCommand) {
                        handleCommand(currentCommand, term);
                        currentCommand = "";
                    }
                    term.write("❯ ");
                } else if (domEvent.key === 'Backspace') {
                    if (currentCommand.length > 0) {
                        term.write("\b \b");
                        currentCommand = currentCommand.slice(0, -1);
                    }
                } else if (printable) {
                    currentCommand += key;
                    term.write(key);
                }
            });
        }
    }, []);

    const handleCommand = (cmd, term) => {
        const [action, ...args] = cmd.trim().split(/\s+/);
        const homeworkName = args.join(" ");

        const findHomework = (name) => {
            if (!name) return null;
            return homeworks.find(hw => hw.title.toLowerCase() === name.toLowerCase());
        };

        switch (action.toLowerCase()) {
            case "help":
                term.writeln("Available commands:");
                term.writeln("  \x1b[36mhelp\x1b[0m         - Shows this list of commands.");
                term.writeln("  \x1b[36mworkls\x1b[0m       - Lists all homeworks.");
                term.writeln("  \x1b[36mopen <name>\x1b[0m  - Shows details for a homework (e.g., 'open Homework 1').");
                term.writeln("  \x1b[36mopeng <name>\x1b[0m - Opens the GitHub page for a homework.");
                term.writeln("  \x1b[36mopenv <name>\x1b[0m - Opens the Vercel demo for a homework.");
                term.writeln("  \x1b[36mclear\x1b[0m        - Clears the terminal screen.");
                break;

            case "workls":
                term.writeln("Homeworks:");
                homeworks.forEach(hw => {
                    term.writeln(`  \x1b[36m${hw.title}\x1b[0m - ${hw.desc}`);
                });
                break;

            case "open":
                const hwDetails = findHomework(homeworkName);
                if (hwDetails) {
                    term.writeln(`Redirecting to details for ${hwDetails.title}...`);
                    window.location.href = `/homeworks/${hwDetails.slug}`;
                } else {
                    term.writeln(`\x1b[31mError: Homework '${homeworkName}' not found.\x1b[0m`);
                }
                break;

            case "openg":
                const hwGit = findHomework(homeworkName);
                if (hwGit) {
                    term.writeln(`Opening GitHub for ${hwGit.title}...`);
                    window.open(hwGit.github, "_blank");
                } else {
                    term.writeln(`\x1b[31mError: Homework '${homeworkName}' not found.\x1b[0m`);
                }
                break;

            case "openv":
                const hwVercel = findHomework(homeworkName);
                if (hwVercel) {
                    term.writeln(`Opening Vercel demo for ${hwVercel.title}...`);
                    window.open(hwVercel.vercel, "_blank");
                } else {
                    term.writeln(`\x1b[31mError: Homework '${homeworkName}' not found.\x1b[0m`);
                }
                break;

            case "clear":
                term.clear();
                break;

            default:
                term.writeln(`\x1b[31mCommand not found: ${cmd}. Type 'help' for a list of commands.\x1b[0m`);
                break;
        }
    };

    return <div ref={terminalRef} id="terminal" className="w-full h-96" />;
}