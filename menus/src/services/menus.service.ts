import { LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { environment } from 'environment/environment';
import { IMenu, Menu, MenusStats } from 'models/menus.model';

export class MenusService {
    private readonly Logger: LoggerService = LoggerService.Instance('Menus API', environment.logDir);

    constructor() { }

    /**
     * Trouve tous les menus
     */
    async findAll(): Promise<Array<IMenu>> {
        try {
            const menus = await Menu.find();

            return menus;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * Trouve un menu en particulier
     * @param id - ID unique de l'menu
     */
    async findOne(id: string): Promise<IMenu | null | undefined> {
        try {
            const menu = await Menu.findById(id);

            return menu;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param id 
     * @param menuData 
     * @returns 
     */
    async update(id: string, menuData: Partial<IMenu>): Promise<IMenu | null | undefined> {
        try {
            const menu = await this.findOne(id);

            if (!menu) {
                throw new NotFoundException('No menu found');
            }

            const updatedMenu = await Menu.findByIdAndUpdate(id, menuData, { new: true });

            this.Logger.info('Menu updated');
            return updatedMenu;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param menuData 
     * @returns 
     */
    async create(menuData: IMenu): Promise<IMenu> {
        try {
            const newMenu: IMenu = await Menu.create(menuData);

            this.Logger.info('Menu created');
            return newMenu;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param id 
     */
    async delete(id: string) {
        try {
            const menu = await this.findOne(id);

            if (!menu) {
                throw new NotFoundException('No menu found');
            }

            await Menu.findByIdAndRemove(id);
            this.Logger.info('Menu deleted');
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }
    
    /**
     * 
     * @returns 
     */
    public async getStats(): Promise<MenusStats | void> {
        try {
            const menusCount = await Menu.count();

            return {
                menusCount
            }
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }
}
