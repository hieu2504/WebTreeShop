namespace TreeShop.Api.ViewModel
{
    public class OrderUpdateRequestModel
    {
        public int OrderId { get; set; }
        public int? TransactStatusId { get; set; }
        public int? PayId { get; set; }
        public string Note { get; set; }
        public string ShippingAddress { get; set; }
    }
}
