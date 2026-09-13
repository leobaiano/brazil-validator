using Xunit;

namespace BrValidator.Tests
{
    public class CpfTests
    {
        [Theory]
        [InlineData("529.982.247-25")]
        [InlineData("52998224725")]
        [InlineData("529 982 247 25")]
        [InlineData("111.444.777-35")]
        [InlineData("935.411.347-80")]
        public void IsValid_AcceptsValid(string value)
        {
            Assert.True(Cpf.IsValid(value));
        }

        [Theory]
        [InlineData("529.982.247-26")]
        [InlineData("111.444.777-36")]
        [InlineData("935.411.347-81")]
        [InlineData("111.111.111-11")]
        [InlineData("123456789")]
        [InlineData("529.982.247-2A")]
        [InlineData("           ")]
        [InlineData("")]
        [InlineData("529abc982xyz247-25")]
        public void IsValid_RejectsInvalid(string value)
        {
            Assert.False(Cpf.IsValid(value));
        }

        [Theory]
        [InlineData("529.982.247-25", "52998224725")]
        [InlineData("52998224725", "52998224725")]
        [InlineData("529 982 247 25", "52998224725")]
        public void Normalize(string input, string expected)
        {
            Assert.Equal(expected, Cpf.Normalize(input));
        }

        [Theory]
        [InlineData("52998224725", "529.982.247-25")]
        [InlineData("529.982.247-25", "529.982.247-25")]
        [InlineData("123", "123")]
        [InlineData("529982247", "529982247")]
        public void Format(string input, string expected)
        {
            Assert.Equal(expected, Cpf.Format(input));
        }
    }
}
