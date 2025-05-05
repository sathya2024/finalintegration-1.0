public class Investment
{
    public string Id { get; set; }
    public int UserId { get; set; }
    public string Type { get; set; }
    public string TransactionType { get; set; }

    // Stock fields
    public string StockName { get; set; }
    public string DematAccount { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public int? NumberOfShares { get; set; }
    public double? Brokerage { get; set; }
    public string BrokerageType { get; set; }
    public double? PurchasePrice { get; set; }

    // Bond fields
    public string FixedIncomeName { get; set; }
    public DateTime? InvestmentDate { get; set; }
    public double? InvestmentAmount { get; set; }
    public double? CouponRate { get; set; }
    public string CompoundingFrequency { get; set; }
    public string InterestType { get; set; }
    public DateTime? MaturityDate { get; set; }

    // Mutual fund fields
    public string SchemeName { get; set; }
    public string FolioNumber { get; set; }
    public string AmountType { get; set; }
    public double? Amount { get; set; }
    public double? Price { get; set; }

    // Redemption/sell info
    public DateTime? RedemptionDate { get; set; }
    public string SellAt { get; set; }
    public double? SellPrice { get; set; }
}
