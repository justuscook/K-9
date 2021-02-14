import fs from 'fs/promises';
import { Command, CommandoClient, CommandoMessage, util } from 'discord.js-commando';
import path from 'path';
import IBuild from '../util/IBuild';
import { isValidHttpUrl } from '../util/general';
import fuse from 'fuse.js';
import { Collection, Message, MessageEmbed, MessageResolvable, TextChannel } from 'discord.js';

export class GetCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'submit',
            group: 'builds',
            memberName: 'submit',
            description: 'Submit/add a build',
        });
    }

    async run(message: CommandoMessage) {
        const build: IBuild = {
            allImages: '',
            authorID: Number(message.author.id),
            instance: '',
            guid: Number(message.id),
            name: ''
        };
        let messages = [];
        const q1 = await message.say('I will you ask you a series of questions to create a build. Answer **none** to leave blank:\nWhat is the champions name? You can use a comma ( , ) to add alias like "Bad-el-Kazar, BEK"');
        const a1 = await message.channel.awaitMessages(((m: Message) => m.author.id === message.author.id), { max: 1, time: 60000 })
            .then(collected => {
                if (collected.first()?.content !== undefined && collected.first()?.content.includes(',')) {
                    let names: string[] = collected.first()?.content.split(',')!;
                    names = names.map(n => { return n.trim() });
                    build.name = names;
                }
                else {
                    build.name = collected.first()?.content!;
                }
            })
            .catch(err => {
                return message.say('You didn\'t give a champion name in time, 1 min.');
            });
        messages.push(q1);
        messages.push(a1);

        const q2 = await message.say('What areas of the game is this build for? Use ( , ) to have multiple areas like "Dungeons, Arena"');
        const a2 = await message.channel.awaitMessages(((m: Message) => m.author.id === message.author.id), { max: 1, time: 60000 })
            .then(collected => {
                if (collected.first()?.content !== undefined && collected.first()?.content.includes(',')) {
                    let instances: string[] = collected.first()?.content.split(',')!;
                    instances = instances.map(i => { return i.trim() });
                    build.instance = instances!;
                }
                else {
                    build.instance = collected.first()?.content!;
                }
            })
            .catch(err => {
                return message.say('You didn\'t give a champion name in time, 1 min.');
            });
        messages.push(q2);
        messages.push(a2);


        //Ask for gear image
        const q3 = await message.say('Do you have a gear image? Use **none** to leave blank.');
        const a3 = await message.channel.awaitMessages(((m: Message) => m.author.id === message.author.id), { max: 1, time: 60000 })
            .then(collected => {
                if (collected.first()?.content !== 'none' || collected.first()?.attachments.size !== 0) {
                    build.gearImage = (collected.first()?.content !== 'none' && collected.first()?.content !== '') ? collected.first()?.content : collected.first()?.attachments.first()?.url;
                }
                if (isValidHttpUrl(build.gearImage!) === false) {
                    return message.reply('That\'s not a valid link, please try again.')
                }
            })
            .catch(err => {
                return message.reply('You didn\'t respond with an image in time, 1 min.');
            });
        messages.push(q3);
        messages.push(a3);

        //Ask for masteries image
        const q4 = await message.say('Do you you have a masteries image? Use **none** to leave blank.');
        const a4 = await message.channel.awaitMessages(((m: Message) => m.author.id === message.author.id), { max: 1, time: 60000 })
            .then(collected => {
                if (collected.first()?.content !== 'none' || collected.first()?.attachments.size !== 0) {
                    build.masteryImage = (collected.first()?.content !== 'none' && collected.first()?.content !== '') ? collected.first()?.content : collected.first()?.attachments.first()?.url;
                }
                if (isValidHttpUrl(build.masteryImage!) === false) {
                    return message.reply('That\'s not a valid link, please try again.')
                }
            })
            .catch(err => {
                return message.reply('You didn\'t respond with an image in time, 1 min.');
            });
        messages.push(q4);
        messages.push(a4);

        const q5 = await message.say('Do you you have a total stats image? Use **none** to leave blank.');
        const a5 = await message.channel.awaitMessages(((m: Message) => m.author.id === message.author.id), { max: 1, time: 60000 })
            .then(collected => {
                if (collected.first()?.content !== 'none' || collected.first()?.attachments.size !== 0) {
                    build.statsImage = (collected.first()?.content !== 'none' && collected.first()?.content !== '') ? collected.first()?.content : collected.first()?.attachments.first()?.url;
                }
                if (isValidHttpUrl(build.statsImage!) === false) {
                    return message.reply('That\'s not a valid link, please try again.')
                }
            })
            .catch(err => {
                return message.reply('You didn\'t respond with an image in time, 1 min.');
            });
        messages.push(q5);
        messages.push(a5);

        const q6 = await message.say('Do you you have any notes to add? Use **none** to leave blank.');
        const a6 = await message.channel.awaitMessages(((m: Message) => m.author.id === message.author.id), { max: 1, time: 60000 })
            .then(collected => {
                if (collected.first()?.content !== undefined)
                    build.note = collected.first()?.content;
            })
            .catch(err => {
                build.note = 'none'
            });
        messages.push(q6);
        messages.push(a6);

        for (let m of messages) {
            if (m instanceof Message) await m.delete();
        }

        return await message.reply(`\`${build.gearImage}\``);
    }

}