import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { TodoParent, NewTodo } from '../wrappers/TodoParent';
import '@ton/test-utils';
import { CompleteTodo, TodoChild } from '../wrappers/TodoChild';

describe('TodoParent', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let todoParent: SandboxContract<TodoParent>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        todoParent = blockchain.openContract(await TodoParent.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await todoParent.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: todoParent.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and todoParent are ready to use
    });

    it("should create todo", async () => {
        const message: NewTodo = {
            $$type: 'NewTodo',
            task: 'todo1'
        }

        await todoParent.send(deployer.getSender(), {
            value: toNano("0.5")
        }, message);

        const todoChildAddr = await todoParent.getTodoAddress(1n);

        const todoChild = blockchain.openContract(TodoChild.fromAddress(todoChildAddr));

        const details = await todoChild.getDetails();

        console.log("details - ", details);

        const messageComplete: CompleteTodo = {
            $$type: 'CompleteTodo',
            seqno: 1n
        }

        await todoParent.send(deployer.getSender(), {
            value: toNano("0.5")
        }, messageComplete);

        console.log("details - ", await todoChild.getDetails());
    });
});
