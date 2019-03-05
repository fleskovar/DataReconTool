var DataType = {
    MASS_FLOWRATE: 1,
    TEMPERATURE: 2,
    DENSITY: 3,
    VOLUME_FLOWRATE: 4
};

export class Property
{
    constructor()
    {
        this.data_type = null;
        this.data_id = null;
        this.is_measured = false;
        this.units = null;
        this.value = null;
        this.reconciled_value = null;
    }
};

export class Stream
{
    constructor()
    {
        this.mass_flowrate = 0;
        this.density = null;
        this.volumetric_flowrate = 0;
    }
};

export class Node
{
    constructor()
    {
        this.balance = 0;
        this.reconciled_balance = 0;
    }
};