import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { NewTodo, TodoChild } from '../wrappers/TodoChild';
import '@ton/test-utils';

describe('TodoChild', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let todoChild: SandboxContract<TodoChild>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        todoChild = blockchain.openContract(await TodoChild.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await todoChild.send(
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
            to: todoChild.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and todoChild are ready to use
    });
});
